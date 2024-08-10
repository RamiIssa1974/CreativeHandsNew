import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IOrder } from '../../../Model/IOrder';
import { IOrderItem } from '../../../Model/IOrderItem';
import { AuthService } from '../../../services/auth.service';
import { cloneDeep } from 'lodash';
import { OrdersService } from '../../../services/orders.service';
import { IProduct } from '../../../Model/IProduct';
import { ProductsService } from '../../../services/products.service';
import { IProductSearchRequest } from '../../../Model/Requests/IProductSearchRequest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISendOrderRequest } from '../../../Model/Requests/ISendOrderRequest';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  isLoading = true;
  showOrderSentMessage = false;
  isSmallView: boolean = false;
  mySubscription: any;
  isCartPage = false;
  sendOrderForm: FormGroup;

  orderTitle = '';
  orderId: number = 0;
  orderdeliveryPrice: number = 0;
  orderStatusId: number = 0;

  order: IOrder = {
    Id: 0,
    StatusId: 0,
    DeleveryPrice: 0,
    CreateDate: new Date(), // default to the current date and time
    Address: '',
    Notes: '',
    Discount: 0,
    Customer: {
      Id: 0,
      Name: '',
      Tel1: '',
      Tel2: '',
      Address: '',
      Notes: '',
      Email: ''
    },
    OrderItems: [] // assuming an empty array for default
  };



  orderClone: IOrder | undefined;

  private _orderDiscount: number | undefined;
  get orderDiscount(): number | undefined {
    return this._orderDiscount;
  }
  set orderDiscount(val: number | undefined) {
    this._orderDiscount = val;
  }

  private _orderDiscountPercent: number = 0;
  get orderDiscountPercent(): number {
    return this._orderDiscountPercent;
  }

  set orderDiscountPercent(val: number) {
    this._orderDiscountPercent = val;
  }

  setOrderDiscount(val: number) {
    this._orderDiscount = val;
    this._orderDiscountPercent = val / this.OrderTotal * 100;
  }
  setOrderDiscountPercent(val: number) {
    this._orderDiscountPercent = val;
    this._orderDiscount = val * this.OrderTotal / 100;
  }

  productName = '';
  productsList: IProduct[] = [];
  filteredProductsList: IProduct[] = [];
  newOrderItem: IOrderItem = {
    Id: -1,
    OrderId: 0,
    Product: {
      Id: 0,
      Name: '',
      Description: '',
      Price: 0,
      SalePrice: 0,
      Barcode: '',
      CategoryId: 0,
      SubCategoryId: 0,
      Categories: [],
      Images: [],
      ProductVariations: [],
      StockQuantity: 0,
      AvailableColours: []
    },
    UnitPrice: 0,
    Quantity: 1, // Set default quantity as 1 or as needed
    Note: '',
    ProductVariation: {
      Id: 0,
      Description: '',
      Price: 0,
      ProductId: 0
    },
    Colours: [] // Default empty array for Colours
  };
  addProductMesssage = '';

  get isMobile(): boolean {
    return window.innerWidth < 768;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get OrderTotal(): number {
    return this.order?.OrderItems?.map(oi => oi.Quantity * oi.UnitPrice).reduce((a, b) => a + b, 0) || 0;
  }


  get OrderTotalQuantity(): number | undefined {
    return this.order?.OrderItems.map(oi => oi.Quantity).reduce((a, b) => a + b, 0);
  }

  get customerName() {
    return this.sendOrderForm.get('CustomerName');
  }
  get customerTel() {
    return this.sendOrderForm.get('CustomerTel');
  }
  get customerAddress() {
    return this.sendOrderForm.get('CustomerAddress');
  }
  get customerNote() {
    return this.sendOrderForm.get('CustomerNote');
  }

  constructor(
    private orersService: OrdersService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private productServices: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrdersService
  ) {
    this.sendOrderForm = this.fb.group({
      StatusId: [0],
      DeleveryPrice: [0],
      CustomerName: ['', [Validators.required, Validators.minLength(3)]],
      CustomerTel: ['', [Validators.required, Validators.minLength(9)]],
      CustomerNote: [''],
      CustomerAddress: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {

    this.route.url.subscribe(url => {
      const path = url[0].path;
      this.isCartPage = (path === 'cart');

      if (this.isCartPage) {
        this.orersService.getCart().subscribe(res => {
          if (res) {
            this.orderId = res.Id;
            this.order = res;
            this.orderdeliveryPrice = this.order.DeleveryPrice;
            this.orderStatusId = this.order.StatusId;
            this._orderDiscountPercent = this.order.Discount;
            this.orderClone = cloneDeep(res);
            this.initializeNewOrderItem(res.Id);
            this.orderService.setShowCart(false);
          }
          this.isLoading = false;
        });
        this.orderTitle = 'عربة المشتريات';

      } else {
        this.route.params.subscribe(params => {
          this.orderId = params['id'];
          this.loadOrderById(false);
        });
        this.orderService.setShowCart(true);
      }
    });

    const search: IProductSearchRequest = {
      Id: -1,
      Barcode: '',
      Description: '',
      Name: '',
      CategoryId: -1,
      SubCategoryId: -1
    };

    this.productServices.getProducts(search).subscribe({
      next: products => {
        this.productsList = products;
        this.filteredProductsList = this.productsList;
      }
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.mySubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  loadOrderById(isWithoutRefresh: boolean) {
    this.orersService.getOrderById(this.orderId).subscribe(res => {
      if (res != null) {
        this.order = res;
        this.orderClone = cloneDeep(res);
        this.initializeNewOrderItem(res.Id);
        this.orderdeliveryPrice = this.order.DeleveryPrice;
        this.orderStatusId = this.order.StatusId;
        this._orderDiscountPercent = this.order.Discount;

        if (isWithoutRefresh) {
          const navigateTo = this.isCartPage ? '/cart' : `/order/${this.orderId}`;
          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate([navigateTo]);
          });
        }
      }
      this.isLoading = false;
    });
  }

  updateFilterVal(prodNameFilter: string) {    
    this.filteredProductsList = this.productsList;
    if (prodNameFilter && prodNameFilter.length > 0) {
      this.filteredProductsList = this.productsList.filter(prod =>
        (prod.Name != null && prod.Name.includes(prodNameFilter)) ||
        (prod.Description != null && prod.Description.includes(prodNameFilter))
      );
    }
  }

  private initializeNewOrderItem(orderId: number) {
    this.newOrderItem = {
      Id: -1,
      OrderId: orderId,
      UnitPrice: 0,
      Quantity: 1,
      Note: '',
      ProductVariation: {
        Id: -1,
        Description: '',
        Price: -1,
        ProductId: -1
      },
      Colours: [],
      Product: {
        Id: -1,
        Name: '',
        Description: '',
        Price: 0,
        SalePrice: 0,
        Barcode: '',
        CategoryId: 0,
        SubCategoryId: 0,
        Categories: [],
        Images: [],
        ProductVariations: [],
        StockQuantity: 0,
        AvailableColours: []
      }
    };
  }

  incQuantity(orderItem: IOrderItem) {
    orderItem.Quantity++;
    this.orderService.updateCartQuantity(1);
  }

  decQuantity(orderItem: IOrderItem) {
    if (orderItem.Quantity > 0) {
      orderItem.Quantity--;
      this.orderService.updateCartQuantity(-1);
    }
  }

  saveOrder() {
    if (this.isOrderChanged()) {
      this.order.StatusId = this.orderStatusId;
      this.order.DeleveryPrice = this.orderdeliveryPrice;
      this.order.Discount = this._orderDiscountPercent;

      this.orersService.saveOrder(this.order).subscribe(() => {
        // Optionally handle success
      });

      this.loadOrderById(true);
    } else {
      alert('لا يوجد تغييرات للحفظ');
    }
  }

  emptyTheCart() {
    if (confirm('هل انت متأكد انك ترغب بافراغ سلة مشترياتك؟')) {
      this.order.OrderItems.forEach(oi => oi.Quantity = 0);
      this.orderService.setCartQuantity(0);
      this.orersService.saveOrder(this.order).subscribe(() => alert('تم حفظ البيانات بنجاح'));
      this.loadOrderById(true);
    }
  }

  isOrderChanged(): boolean {
    const isEqual = JSON.stringify(this.order) !== JSON.stringify(this.orderClone) ||
      this.order.DeleveryPrice !== this.orderdeliveryPrice ||
      this.order.StatusId !== this.orderStatusId ||
      this.order.Discount !== this.orderDiscount;

    return isEqual;
  }

  onSelectedProducFocus() {
    const elm = document.querySelector('.products-dropdownlist') as HTMLElement;
    if (elm) {
      elm.style.display = 'block';
    }
  }

  // onSelectedProducLoseFocus() {
  //   const elm = document.querySelector('.products-dropdownlist') as HTMLElement;
  //   if (elm) {
  //     elm.style.display = 'none';
  //   }
  // }
  onSelectedProducLoseFocus(event: FocusEvent) {
    const target = event.relatedTarget as HTMLElement;
    const dropdown = document.querySelector('.products-dropdownlist') as HTMLElement;

    if (dropdown && !dropdown.contains(target)) {
      dropdown.style.display = 'none';
    }
  }




  selectProduct(val: number) {
    //console.log("Rami Issa Hii: ", val);
    const selectedProduct = this.productsList.find(prod => prod.Id === val);
    if (selectedProduct) {
      this.newOrderItem.Product.Id = val;
      this.newOrderItem.Product.Name = selectedProduct.Name;
      this.newOrderItem.UnitPrice = selectedProduct.Price;
      this.newOrderItem.Quantity = 1;
      const elm = document.querySelector('.products-dropdownlist') as HTMLElement;
      if (elm) {
        elm.style.display = 'none';
      }
      this.validateAddProduct();
    }
  }

  addSelectedProductToOrder() {
    console.log("Rami Issa Hii addSelectedProductToOrder");
    if (this.validateAddProduct()) {
      const existProduct = this.order.OrderItems.find(oi => oi.Product.Id === this.newOrderItem.Product.Id);
      if (existProduct) {
        existProduct.Quantity += this.newOrderItem.Quantity;
      } else {
        this.order.OrderItems.push(this.newOrderItem);
      }
      this.orderService.setCartQuantity(this.newOrderItem.Quantity);
      this.initializeNewOrderItem(this.order.Id);
    }
  }

  validateAddProduct(): boolean {
    const elmSelectedProduct = document.querySelector('.add-order-item .selected-product') as HTMLElement;
    if (this.newOrderItem.Product.Id < 0) {
      this.addProductMesssage = 'الرجاء اختيار المنتج';
      if (elmSelectedProduct) {
        elmSelectedProduct.classList.add('invalid');
      }
      return false;
    } else {
      if (elmSelectedProduct) {
        elmSelectedProduct.classList.remove('invalid');
      }
      this.addProductMesssage = '';
    }
    return true;
  }

  incAddProdQuantity(orderItem: IOrderItem) {
    orderItem.Quantity++;
  }

  decAddProdQuantity(orderItem: IOrderItem) {
    if (orderItem.Quantity > 1) {
      orderItem.Quantity--;
    }
  }

  orderItemQuantityChanged(quantity: number, orderItem: IOrderItem) {
    orderItem.Quantity = quantity;
  }

  orderItemUnitPriceChanged(price: number, orderItem: IOrderItem) {
    orderItem.UnitPrice = price;
  }

  orderItemDeleted(orderItemId: number) {
    this.order.OrderItems = this.order.OrderItems.filter(obj => obj.Id !== orderItemId);
    this.saveOrder();
  }

  sendOrder() {
    if (this.sendOrderForm.valid) {
      this.isLoading = true;
      const request: ISendOrderRequest = {
        OrderId: this.order.Id,
        UserID: this.orersService.getUserIdFromCookies(),
        CustomerName: this.customerName?.value,
        CustomerTel: this.customerTel?.value,
        Address: this.customerAddress?.value,
        Notes: this.customerNote?.value
      };

      this.orersService.sendOrder(request).subscribe(result => {
        this.isLoading = false;
        if (result) {
          this.showOrderSentMessage = true;
          setTimeout(() => {
            this.showOrderSentMessage = false;
            this.orderService.setCartQuantity(0); // Initialize the cart quantity
            this.loadOrderById(true);
          }, 3000);
        } else {
          console.log('Order send failed');
        }
      });
    } else {
      const validationMessage = !this.customerName?.valid ? 'الرجاء ادخال اسمك الكامل'
        : !this.customerTel?.valid ? 'الرجاء ادخال رقم هاتفك الصحيح'
          : !this.customerAddress?.valid ? 'الرجاء ادخال عنوانك'
            : null;

      alert(validationMessage);
    }
  }
}
