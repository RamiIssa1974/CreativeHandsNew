import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategory } from '../../Model/ICategory';
import { IProduct } from '../../Model/IProduct';
import { IProductVariation } from '../../Model/IProductVariation';
import { IProductSearchRequest } from '../../Model/Requests/IProductSearchRequest';
import { ISaveProductRequest } from '../../Model/Requests/ISaveProductRequest';
import { CustomValidator } from '../../Model/Validators/CustomValidators';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {
  newFiles: string[] = [];
  deletedFiles: string[] = [];
  isLoading: boolean = false;
  productId: number = -1;
  product: IProduct | null = null;
  categories: ICategory[] = [];
  filesToUpload: File[] = [];
  selectedfileName: string = "please select a file";
  errorMessage = 'OK';
  productForm: FormGroup = new FormGroup({});
  filesCounter: number = 0;
  colours: string[] = [];
  selectedColour: string = '#0000ff';
  
  productVariationPrice=new FormControl('');
  productVariationDescription=new FormControl('');

  // Accessors
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get fileUploaders(): FormArray {
    //console.log(JSON.stringify(this.productForm.controls['file_uploaders']));
    return this.productForm.controls['file_uploaders'].value as FormArray;
  };
  get productImages(): FormArray {
    return this.productForm.get('Images') as FormArray;
  }
  

  get prodId() {
    return this.productForm.get('Id');
  }
  get prodName() {
    return this.productForm.get('Name');
  }
  get prodPrice() {
    return this.productForm.get('Price');
  }
  get prodDescription() {
    return this.productForm.get('Description');
  }
  get prodSalePrice() {
    return this.productForm.get('SalePrice');
  }
  get prodStockQuantity() {
    return this.productForm.get('StockQuantity');
  }
  get prodBarcode() {
    return this.productForm.get('Barcode');
  }

  get productVariations(): FormArray {
    return this.productForm.get('ProductVariations') as FormArray;
  }
  get prodAvailableColours(): FormArray {
    return this.productForm.get('AvailableColours') as FormArray;
  }

  constructor(private route: ActivatedRoute,
    private productServices: ProductsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

    ngOnInit() {
      this.productVariationPrice = new FormControl('');
    this.productVariationDescription = new FormControl('');

      if (!(this.isLoggedIn && this.isAdmin)) {
        this.router.navigateByUrl(this.authService.redirectUrl || '/');
      }
      this.productForm = this.getEmptyForm();
      this.route.params.subscribe(params => {
        this.productId = params['id'];
        this.productServices.getCategories().subscribe({
          next: cats => {
            cats.forEach(cat => cat.IsBelongToProduct = false);
            this.categories = cats;
          },
          error: err => this.errorMessage = err
        });
    
        if (this.productId != null) {
          let search: IProductSearchRequest = { Id: this.productId, Barcode: "", Description: "", Name: "", CategoryId: -1, SubCategoryId: -1 };
          this.productServices.getProducts(search).subscribe({
            next: products => {
              this.product = products[0];
              this.categories.forEach(cat => {
                cat.IsBelongToProduct = this.product?.Categories?.some(ct => ct.Id === cat.Id) || false;
              });
              this.productForm = this.getFormFromProduct(this.product);
            },
            error: err => this.errorMessage = err
          });
        } else {
          this.productForm = this.getEmptyForm();
        }
      });
    }
    
  onCatChange(event: Event, catId: number): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const category = this.categories.find(cat => cat.Id === catId);
    if (category) {
      category.IsBelongToProduct = isChecked;
      const categoriesArray = this.productForm.get('Categories') as FormArray;
      if (isChecked) {
        categoriesArray.push(new FormControl(catId));
      } else {
        const index = categoriesArray.controls.findIndex(ctrl => ctrl.value === catId);
        if (index !== -1) {
          categoriesArray.removeAt(index);
        }
      }
      categoriesArray.updateValueAndValidity();
      this.productForm.updateValueAndValidity();
    }
  }

  // onSelectFile(files: FileList) {
  //   //console.log("url" + JSON.stringify(files[0]));
  //   this.selectedfileName = files[0].name;
  //   //this.filesToUpload.push.apply(this.filesToUpload, files);
  //   this.filesToUpload.push(...files);
  //   (this.productForm.controls['Images'].value as FormArray).push(new FormControl([files[0].name]));
  //   this.productForm.controls['Images'].updateValueAndValidity();
  //   this.productForm.updateValueAndValidity();
  // }
  onSelectFile(files: FileList): void {    
    if (files.length > 0) {
      
      // Convert FileList to an array of File objects
      const fileArray: File[] = Array.from(files);
  
      // Spread the fileArray into filesToUpload
      this.filesToUpload.push(...fileArray);
  
      // Ensure that `Images` form array is correctly updated
      const imagesArray = this.productForm.get('Images') as FormArray;
      
      if (imagesArray) {
        fileArray.forEach(file => {
          imagesArray.push(new FormControl(file.name));          
        });
  
        // Update the form array and the form
        imagesArray.updateValueAndValidity();
        this.productForm.updateValueAndValidity();
      } else {
        console.error('Images form array is not defined');
      }
    }
  }
  

  deleteFile(filename: string, index: number) {
    //this.productForm.controls['Images'].value.removeAt(index);
    (this.productForm.get('Images') as FormArray).removeAt(index);
    this.filesToUpload.splice(index, 1);
    this.productForm.controls['Images'].updateValueAndValidity();
    this.productForm.updateValueAndValidity();
  }

  getEmptyForm() {
    return this.fb.group({
      Id: [{ value: 0, disabled: true }],
      Name: ["", [Validators.required, Validators.minLength(3)]],
      Description: "",
      Price: ["", [Validators.required, Validators.min(0.01), CustomValidator.numeric]],
      SalePrice: ["", [Validators.min(0), CustomValidator.numeric]],
      StockQuantity: ["", [Validators.required, Validators.min(0), CustomValidator.numeric]],
      Barcode: "",
      CategoryId: 0,
      SubCategoryId: 0,
      Images: this.fb.array([]),
      Categories: this.fb.array([]),
      ProductVariations: this.fb.array([]),
      AvailableColours: this.fb.array([])
    });
  }

  getFormFromProduct(product: IProduct) {
    return this.fb.group({
      Id: [{ value: product.Id, disabled: true }],
      Name: [product.Name, [Validators.required, Validators.minLength(3)]],
      Description: product.Description,
      Price: [product.Price, [Validators.required, Validators.min(0), CustomValidator.numeric]],
      SalePrice: [product.SalePrice, [Validators.min(0), CustomValidator.numeric]],
      StockQuantity: [product.StockQuantity, [Validators.required, Validators.min(0), CustomValidator.numeric]],
      Barcode: product.Barcode,
      CategoryId: product.CategoryId,
      SubCategoryId: product.SubCategoryId,
      Images: this.getImagesArray(product),
      Categories: this.getCategoreisArray(product),
      ProductVariations: this.getProductVariationsArray(product),
      AvailableColours: this.getProductAvailableColoursArray(product)  // Ensure this is initialized properly
    });
  }

  getImagesArray(product: IProduct) {
    var imagesFgArr = this.fb.array([]);
    product.Images.forEach(im => imagesFgArr.push(new FormControl([im])));
    return imagesFgArr;
  }
  getCategoreisArray(product: IProduct) {
    var imagesFgArr = this.fb.array([]);
    product.Categories.forEach(ct => imagesFgArr.push(new FormControl([ct.Id])));
    return imagesFgArr;
  }

  // getProductVariationsArray(product: IProduct) :FormArray {
  //   var varsFgArr = this.fb.array([]);
  //   product.ProductVariations.forEach(pv => {
  //     const group = new FormGroup({
  //       Description: new FormControl(pv.Description),
  //       Price: new FormControl(pv.Price)
  //     });

  //     varsFgArr.push(group);
  //   });
  //   return varsFgArr;
  // }
  getProductVariationsArray(product: IProduct): FormArray {
    const varsFgArr = this.fb.array<FormGroup>([]);

    product.ProductVariations.forEach(pv => {
      const group = new FormGroup({
        Description: new FormControl(pv.Description),
        Price: new FormControl(pv.Price)
      });

      varsFgArr.push(group);
    });

    return varsFgArr;
  }

  getProductAvailableColoursArray(product: IProduct): FormArray<FormGroup> {
    const clrsFgArr = this.fb.array<FormGroup>([]);

    product.AvailableColours.forEach(clr => {
      const group = new FormGroup({
        Colour: new FormControl(clr)
      });

      clrsFgArr.push(group);
    });

    return clrsFgArr;
  }



   //Save Product
   saveProduct(): void {
    this.isLoading = true;
  
    // Cast each control to FormControl
    const productImgs = this.productImages.controls.map((im: AbstractControl) => {
      const formControl = im as FormControl;
      return formControl.value.toString().trim();
    });
  
    const productVariationsArray = this.productVariations;
  
    // Map over the FormArray's controls, assuming they are FormGroup instances
    const prodVars: IProductVariation[] = productVariationsArray.controls.map((pv: AbstractControl) => {
      const group = pv as FormGroup;
      return {
        Description: group.get('Description')?.value || '',
        Price: parseFloat(group.get('Price')?.value) || 0
      };
    }) as IProductVariation[];
  
    const request: ISaveProductRequest = {
      Id: (this.prodId?.value ?? 0) as number,
      Name: this.prodName?.value ?? '',
      Description: this.prodDescription?.value ?? '',
      Barcode: this.prodBarcode?.value ?? '',
      Price: (this.prodPrice?.value ?? 0) as number,
      SalePrice: (this.prodSalePrice?.value ?? 0) as number,
      StockQuantity: (this.prodStockQuantity?.value ?? 0) as number,
      Categories: this.categories.filter(ct => ct.IsBelongToProduct).map(cat => cat.Id),
      Images: productImgs,
      UploadedImages: [],
      ProductVariations: prodVars,
      AvailableColours: this.prodAvailableColours.controls.map(clr => clr.value.Colour)
    };
  
    this.productServices.saveProductAndFiles(this.filesToUpload, request).subscribe(
      uploadRes => {
        uploadRes.UploadedImages.forEach(im => request.UploadedImages.push(im));
        request.Id = uploadRes.ProductId;
        this.productServices.saveProduct(request).subscribe({
          next: (productId) => {
            this.isLoading = false;
            this.router.navigateByUrl('/add-product/' + uploadRes.ProductId);
          },
          error: err => { 
            this.errorMessage = err; 
            console.log("saved failed with error:" + err); 
            this.isLoading = false; 
          }
        });
      }
    );
  }
  
   // End of Save Product


  public InvalidControls() {
    const invalid = [];
    const controls = this.productForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  deleteProductVariations(index: number): void {
    const productVariationsArray = this.productVariations;
    productVariationsArray.removeAt(index);
  }

  deleteAvailableColour(index: number): void {
    const availableColoursArray = this.prodAvailableColours;
    availableColoursArray.removeAt(index);
  }
  // deleteProductVariations(index: number): void {
  //   this.productForm.controls['ProductVariations'].value.controls.splice(index, 1);
  // }
  // deleteAvailableColour(index: number): void {
  //   this.productForm.controls['AvailableColours'].value.controls.splice(index, 1);
  // }

  addAvailableColour() {
    const group = new FormGroup({
      Colour: new FormControl(this.selectedColour)
    });
    const availableColoursArray = this.productForm.get('AvailableColours') as FormArray;
    if (availableColoursArray) {
      availableColoursArray.push(group);
    } else {
      console.error('AvailableColours form array is not defined');
    }
  }

   
  addVariation(price: FormControl, description: FormControl): void {
    // Ensure that the controls are valid FormControl instances
     
      // Ensure that both price and description have values
      if (price.value && description.value) {
        // Create a new FormGroup for the variation
        const group = this.fb.group({
          Description: [description.value],
          Price: [price.value]
        });
  
        // Get the FormArray of product variations
        const productVariationsArray = this.productVariations;
  
        // Add the new variation group to the FormArray
        productVariationsArray.push(group);
  
        // Reset the price and description controls
        this.resetVariationControls();
        //price.reset();
        //description.reset();
      }
     
  }
  resetVariationControls(): void {
    // Reset the controls
    this.productVariationPrice.setValue('');
    this.productVariationDescription.setValue('');
  }
  
}
