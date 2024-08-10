import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { IProduct } from '../Model/IProduct';
import { IProductSearchRequest } from '../Model/Requests/IProductSearchRequest';
import { shareReplay, tap, map, catchError } from 'rxjs/operators';
import { ICategory } from '../Model/ICategory';
import { ISaveProductRequest } from '../Model/Requests/ISaveProductRequest';
import { environment } from '../../environments/environment';
import { IUploadFilesRespone } from '../Model/Responses/IUploadFilesResponse';
import { IProductVariation } from '../Model/IProductVariation';
import { IImage } from '../Model/IImage';
import { IProductColour } from '../Model/IProductColour';
import { IProductCategory } from '../Model/IProductCategory';
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  isUploadig: boolean = false;
  savedProductId: number = 0;


  private getProductUrl = environment.baseApiUrl + "api/products/GetProducts";
  private getCategoriesUrl = environment.baseApiUrl + "api/products/Categories";
  private getImagesUrl = environment.baseApiUrl + "api/products/Images";
  private getProductVariationsUrl = environment.baseApiUrl + "api/products/ProductVariations";
  private getAvailableColoursUrl = environment.baseApiUrl + "api/products/AvailableColours";
  private getProductCategoriesUrl = environment.baseApiUrl + "api/products/ProductCategories";
  private saveProductUsrl = environment.baseApiUrl + "api/products/Product";
  private uploadFilesUrl = environment.baseApiUrl + "Api/UploadFiles";

  getCategories() {
    return this.categories$;
  }
  getCategoryById(categoryId: number): Observable<ICategory> {
    if (this.categories$)
      return this.categories$.pipe(
        map(categories => {
          const category = categories.find(ct => ct.Id === categoryId);
          return category ? category : { Id: -1, Name: '', IsBelongToProduct: false };
        })
      );
    else
      return of({ Id: -1, Name: '', IsBelongToProduct: false });
  }

  get getSavedProductId(): number {
    return this.savedProductId;
  }
  constructor(private http: HttpClient) {
    //console.log("ProductsService Calling constructor")
  }

  saveProductAndFiles(filesToUpload: File[], prodctSaveData: ISaveProductRequest): Observable<IUploadFilesRespone> {
    if (filesToUpload.length > 0) {
      this.isUploadig = true;
      const fd = new FormData();

      filesToUpload.forEach(fileToUpload => fd.append("files", fileToUpload, fileToUpload.name));
      fd.append("productId", prodctSaveData.Id.toString());

      return this.http.post<IUploadFilesRespone>(this.uploadFilesUrl, fd);
    }
    return of({
      VideoId: -1,
      ProductId: prodctSaveData.Id,
      PurchaseId: -1,
      UploadedImages: []
    });
  }

  saveProduct(prodctSaveData: ISaveProductRequest): Observable<number> {
    return this.http.post<number>(this.saveProductUsrl, prodctSaveData).pipe(
      tap(res => {
        if (res > 0) {
          this.dbProducts$ = this.getProductsFromDb().pipe(shareReplay(CACHE_SIZE));
        }
      })
    );
  }

  dbProducts$ = this.getProductsFromDb().pipe(shareReplay(CACHE_SIZE));
  categories$ = this.getCategoriesFromServer().pipe(shareReplay(CACHE_SIZE));
  images$ = this.http.get<IImage[]>(this.getImagesUrl).pipe(shareReplay(CACHE_SIZE),
    catchError(error => {
      console.error('Error fetching product Images:', error);
      return of([]);  // Return an empty array if the data is not available
    })
  );;

  productVariations$ = this.http.get<IProductVariation[]>(this.getProductVariationsUrl).pipe(
    shareReplay(CACHE_SIZE),
    catchError(error => {
      console.error('Error fetching product variations:', error);
      return of([]);  // Return an empty array if the data is not available
    })
  );

  availableColours$ = this.http.get<IProductColour[]>(this.getAvailableColoursUrl).pipe(
    shareReplay(CACHE_SIZE),
    catchError(error => {
      console.error('Error fetching available colours:', error);
      return of([]);  // Return an empty array if the data is not available
    })
  );

  productCategory$ = this.http.get<IProductCategory[]>(this.getProductCategoriesUrl).pipe(shareReplay(CACHE_SIZE),
    catchError(error => {
      console.error('Error fetching product variations:', error);
      return of([]);  // Return an empty array if the data is not available
    })
  );


  combined$ = combineLatest([
    this.dbProducts$,
    this.categories$,
    this.images$,
    this.availableColours$,
    this.productVariations$,
    this.productCategory$]);



  products$ = this.combined$.pipe(
    map(([products, categories, images, colours, variations, productCats]) => {
      //console.log("Products from combined$: ", products); // Log products from combined$
      return products.map(product => ({
        ...product,
        Categories: categories.filter(ct => productCats.some(pc => pc.ProductId === product.Id && pc.CategoryId === ct.Id)),
        Images: images.filter(im => im.ProductId === product.Id).map(img => img.Id + "." + img.Extension.trim()),
        ProductVariations: variations.filter(vr => vr.ProductId === product.Id),
        AvailableColours: colours.filter(cl => cl.ProductId === product.Id).map(cl => cl.Code)
      } as IProduct));
    })
  );


  getProducts(searchParam: IProductSearchRequest): Observable<IProduct[]> {
    //console.log("getProducts => searchParam:", searchParam);
    return this.products$.pipe(
      map(products => {
        //console.log("Products before filtering:", products);
        return products.filter(pr => {
          const idMatches = searchParam.Id < 0 || searchParam.Id === pr.Id;
          const nameMatches = !searchParam.Name || pr.Name.includes(searchParam.Name);
          const descriptionMatches = !searchParam.Description || pr.Description.includes(searchParam.Description);
          const barcodeMatches = !searchParam.Barcode || pr.Barcode.includes(searchParam.Barcode);
          const categoryMatches = searchParam.CategoryId < 0 || pr.Categories.some(cat => cat.Id === searchParam.CategoryId); 
          return idMatches && nameMatches && descriptionMatches && barcodeMatches && categoryMatches;
        });
      })
      //,tap(filteredProducts => {console.log("Filtered products:", filteredProducts);})
    );
  }

  //getProductsFromDb(search: IProductSearchRequest): Observable<IProduct[]> {
  getProductsFromDb(): Observable<IProduct[]> {
    let searchParam: IProductSearchRequest = { Id: -1, Barcode: "", Description: "", Name: "", CategoryId: -1, SubCategoryId: -1 };
    let request = JSON.stringify(searchParam);
    //console.log("getProductsFromDb=>searchParam: " + request);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      })
    };
    return this.http.post<IProduct[]>(this.getProductUrl, request, httpOptions);
  }

  getCategoriesFromServer(): Observable<ICategory[]> {

    return this.http.get<any[]>(this.getCategoriesUrl).pipe(

    );
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
