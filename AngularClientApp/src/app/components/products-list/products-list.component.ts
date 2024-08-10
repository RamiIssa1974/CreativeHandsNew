import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { createDefaultProduct, IProduct } from '../../Model/IProduct';
import { ProductsService } from '../../services/products.service';
import { IProductSearchRequest } from '../../Model/Requests/IProductSearchRequest';
import { AuthService } from '../../services/auth.service';
import { FilterService } from '../../services/filter.service';
import { OrdersService } from '../../services/orders.service';
import { IOrder } from '../../Model/IOrder';
import { IOrderItem } from '../../Model/IOrderItem';
//import { Renderer } from '@angular/compiler-cli/ngcc/src/rendering/renderer';
import { ActivatedRoute } from '@angular/router';
//import { CookieService} from 'ngx-cookie-service'
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  //selectedProduct: IProduct = createDefaultProduct();
  selectedProduct: IProduct | null = null;

  CategoryName: string = "";
  categoryId: number = 6;
  emptySearchMessage: string = "لم يتم العثور على كلمة البحث";
  showEmptySearch: boolean = false;
  isAlive = true;
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  errorMessage = 'OK';
  showAddedToCartMessage = false;
  selectedColours: string[] = [];
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  clickedImage: HTMLImageElement | null = null;;
  constructor(private route: ActivatedRoute,
    private productServices: ProductsService,
    private authService: AuthService,
    private filterService: FilterService,
    private orderService: OrdersService,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      let isSelected = false;
      if (e.target == this.clickedImage) {
        isSelected = (e.target as HTMLImageElement).classList.contains("selected-image");
      }
      let selectedImages: HTMLElement | null = document.querySelector("img.selected-image");
      if (selectedImages) {
        selectedImages.classList.remove("selected-image");
      }

      if (e.target == this.clickedImage) {
        if (!isSelected) {
          (e.target as HTMLImageElement).classList.add("selected-image");
        }
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {      
      const idParam = params['id'];
      this.categoryId = isNaN(+idParam) ? -1 : +idParam;

      this.productServices.getCategoryById(this.categoryId).subscribe(cat => {
        if (cat) this.CategoryName = cat.Name;
      });
      let searchFilter = params['search'];
      //console.log("products-lest: this.productId:" + JSON.stringify(params));
      var searchId = !isNaN(searchFilter) ? searchFilter : -1;
      let search: IProductSearchRequest = { Id: searchId, Barcode: searchFilter, Description: searchFilter, Name: searchFilter, CategoryId: this.categoryId, SubCategoryId: -1 };      
      this.productServices.getProducts(search).subscribe({
        next: products => {
          this.products = products;
          this.filteredProducts = this.products;
          this.showEmptySearch = !this.filteredProducts || !this.filteredProducts.length;
        },
        error: err => this.errorMessage = err
      });
    });
    this.orderService.setShowCart(true);
    //document.cookie = "name=Rami";
    console.log("document.cookie:" + this.orderService.getUserIdFromCookies());

    this.filterService.productFilterOBS.subscribe(filterStr => {
      this.showEmptySearch = false;
      var searchId = !isNaN(parseInt(filterStr)) ? parseInt(filterStr) : -1;
      this.filteredProducts = this.products.filter(prod =>
        prod.Name.includes(filterStr) ||
        prod.Description.includes(filterStr) ||
        (searchId > 0 && prod.Id == searchId));

      console.log("this.filteredProducts.length: " + !this.filteredProducts.length);
      this.showEmptySearch = (filterStr.length > 0) && (!this.filteredProducts || !this.filteredProducts.length);
    });
  }

  incAddProdQuantity(elm: HTMLInputElement) {
    if (elm && elm.value) {
      elm.value = (parseInt(elm.value, 10) + 1).toString();
    }
  }
  decAddProdQuantity(elm: HTMLInputElement) {
    let value = parseInt(elm.value, 10);
    if (value > 1) {
      value--;
      elm.value = value.toString();
    }
  }

  addToCart(product: IProduct, quantity: number, selectedPrice: HTMLSelectElement) {
    // console.log("quantity:" + quantity + "product:" + JSON.stringify(product));
    let productVariationsDiv: HTMLDivElement | null = null;
    if (product.ProductVariations.length > 0) {
      let id = "productVariations" + product.Id.toString() + "Div";
      console.log("productVariations id is:" + id);
      productVariationsDiv = document.querySelector("#" + id);

      if (!selectedPrice) {
        (productVariationsDiv as HTMLDivElement).classList.remove("hidden");
        return;
      }
    }
    let prodVar = product.ProductVariations.find(x => x.Id.toString() == selectedPrice.value);
    let orderItem: IOrderItem = {
      Id: -1,
      OrderId: -1,
      UnitPrice: prodVar ? prodVar.Price : -1,
      Quantity: quantity, Note: "",
      ProductVariation: prodVar ?? null,
      Product: product,
      Colours: this.selectedColours
    };

    this.orderService.addToCart(orderItem).subscribe(orderId => {
      this.selectedColours = [];
      this.orderService.updateCartQuantity(orderItem.Quantity)
      if (productVariationsDiv != null) {
        (productVariationsDiv as HTMLDivElement).classList.add("hidden");
      }
    });

    this.showAddedToCartMessage = true;
    setTimeout(() => {
      this.showAddedToCartMessage = false;
    }, 3000);
  }//End of addToCart function

  closeDiv(productId: number) {
    let id = "productVariations" + productId + "Div";
    let productVariationsDiv: HTMLDivElement | null = document.querySelector("#" + id);

    (productVariationsDiv as HTMLDivElement).classList.add("hidden");
  }
  changeSelectedProductVariation(product: IProduct, selectedPriceId: string, prodQuantity: HTMLInputElement, varTotal: HTMLInputElement) {
    const selectedPriceIdNumber = Number(selectedPriceId);
    const prodVar = product.ProductVariations.find(x => x.Id === selectedPriceIdNumber);
    if (prodVar) {

      varTotal.value = (Number(prodVar.Price) * Number(prodQuantity.value)).toString();
    } else {
      varTotal.value = '0';  // Set to default value if not found
    }
  }


  selectColour(event: Event, colour: string) {
    const target = event.target as HTMLElement;
    const hasClass = target.classList.contains('selected');

    if (hasClass) {
      target.classList.remove('selected');
      this.selectedColours = this.selectedColours.filter(clr => clr !== colour);
    } else {
      target.classList.add('selected');
      this.selectedColours.push(colour);
    }
  }

  showProduct(product: IProduct):void {
    this.selectedProduct = product;
    let productPopup: HTMLDivElement | null = document.querySelector(".popup");
    if (productPopup != null)
      productPopup.hidden = false;
    let modalBackdrop: HTMLDivElement | null = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.style.display = "block";
    } else {
      console.error("Modal backdrop element not found");
    }
  }
  closeProductDetailsPopup(): void {
    this.selectedProduct = null;
  }
}
