import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IOrder } from '../Model/IOrder';
import { IOrderItem } from '../Model/IOrderItem';
import { IAddToCartRequest } from '../Model/Requests/IAddToCartRequest';
import { IOrderSearchRequest } from '../Model/Requests/IOrderSearchRequest';
import { ISendOrderRequest } from '../Model/Requests/ISendOrderRequest';

@Injectable({
  providedIn: 'root'
})
export class OrdersService implements OnInit {
  private getCartUrl = environment.baseApiUrl + "api/orders/cart";
  private getOrderUrl = environment.baseApiUrl + "api/orders/Order";
  private getOrdersUrl = environment.baseApiUrl + "api/orders/Orders";
  private saveOrderUrl = environment.baseApiUrl + "api/orders/SaveOrder";
  private ChangeOrderStatusUrl = environment.baseApiUrl + "api/orders/ChangeOrderStatus";
  private addToCartUrl = environment.baseApiUrl + "api/orders/add-to-cart";
  private sendOrderUrl = environment.baseApiUrl + "api/orders/SendOrder";
  initialCartQuantity = 0;
  cartOrder!: IOrder;

  constructor(private http: HttpClient) {
    this.getCart().subscribe(order => {
      if (order) {
        this.initialCartQuantity = order.OrderItems.map(oi => oi.Quantity).reduce((a, b) => a + b, 0);
        this.setCartQuantity(this.initialCartQuantity);
      } else {
        this.setCartQuantity(0);
      }
    })
  }
  ngOnInit(): void {
    console.log("ngOnInit");
    this.getCart().subscribe(order => {
      this.initialCartQuantity = order.OrderItems.map(oi => oi.Quantity).reduce((a, b) => a + b, 0);
      this.setCartQuantity(this.initialCartQuantity);
      this.cartOrder = order;
    })
  }

  public loadCartQuantity() {
    this.getCart().subscribe(cart => {
      if (cart) {
        const quantity = cart.OrderItems.map(oi => oi.Quantity).reduce((a, b) => a + b, 0);
        this.cartQuantityBS$.next(quantity);
      } else {
        this.cartQuantityBS$.next(0);
      }
    });
  }
  getOrderById(orderId: number): Observable<IOrder> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Origin': '*'
      })
    };
    let request: IOrderSearchRequest = { OrderId: orderId, CustomerId: -1, StatusId: -1, CustomerName: "", CustomerTel: "" };
    return this.http.post<IOrder>(this.getOrderUrl, request);
  }

  getOrders(requuest: IOrderSearchRequest): Observable<IOrder[]> {
    return this.http.post<IOrder[]>(this.getOrdersUrl, requuest);

  }
  saveOrder(order: IOrder): Observable<number> {
    this.initialCartQuantity = order.OrderItems.map(oi => oi.Quantity).reduce((a, b) => a + b, 0);
    this.setCartQuantity(this.initialCartQuantity);
    return this.http.post<number>(this.saveOrderUrl, order);
  }

  changeOrderStatus(order: IOrder): Observable<number> {
    return this.http.post<number>(this.ChangeOrderStatusUrl, order);
  }


  sendOrder(request: ISendOrderRequest): Observable<boolean> {
    return this.http.post<boolean>(this.sendOrderUrl, request);
  }

  getUserIdFromCookies() {
    const cartId = document.cookie.split('; ').find(row => row.startsWith("userId"));
    if (!cartId) {
      var id = this.getGuidId();
      document.cookie = "userId=" + id;
      return id;
    }
    else {
      return cartId.split('=')[1];
    }
  }

  getGuidId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getCart(): Observable<IOrder> {
    let userId: string = this.getUserIdFromCookies();
    let request = { UserId: userId };
    return this.http.get<IOrder>(this.getCartUrl + "?userId=" + userId);
  }

  addToCart(ordrItem: IOrderItem): Observable<number> {
    let request: IAddToCartRequest = {
      UserId: this.getUserIdFromCookies(),
      OrderId: ordrItem.OrderId,
      ProductId: ordrItem.Product.Id,
      ProductVariationId: ordrItem.ProductVariation?.Id ?? -1,
      Quantity: ordrItem.Quantity,
      ProductPrice: ordrItem.Product.Price ?? 0,
      ProductSalePrice: ordrItem.Product.SalePrice ?? 0,
      ProductUnitPrice: ordrItem.UnitPrice,
      OrderItemColours: ordrItem.Colours,
      Note: ordrItem.Note,
    };
    return this.http.post<number>(this.addToCartUrl, request);
  }

  //cart Quantity begaviour object
  private cartQuantityBS$ = new BehaviorSubject<number>(this.initialCartQuantity);
  cartQuantityOBS = this.cartQuantityBS$.asObservable();
  public setCartQuantity(quantity: number) {
    console.log("setting currentQuantity to: " + quantity);
    this.cartQuantityBS$.next(quantity);
  }
  public updateCartQuantity(quantity: number) {
    let newval: number = 0;
    if (quantity) {
      let currentQuantity: number = this.cartQuantityBS$.getValue();
      newval = +currentQuantity + +quantity;
      //console.log("updating currentQuantity to: " + newval);
    }
    this.cartQuantityBS$.next(newval);
  }

  //show cart icon begaviour object
  private showCartIconBS$ = new BehaviorSubject<boolean>(true);
  showCartIconOBS = this.showCartIconBS$.asObservable();
  public setShowCart(newval: boolean) {
    this.showCartIconBS$.next(newval);
    console.log("showCartIcon set to:" + newval);

    if (newval) {
      if (this.cartOrder) {
        this.cartQuantityBS$.next(this.cartOrder.OrderItems.map(oi => oi.Quantity).reduce((a, b) => a + b, 0));
      }
      else {

        this.getCart().subscribe(cart => {
          if (cart) {
            this.cartOrder = cart;
            this.cartQuantityBS$.next(this.cartOrder.OrderItems.map(oi => oi.Quantity).reduce((a, b) => a + b, 0));
          }
          else {
            this.cartQuantityBS$.next(0);
          }
        });
      }
    }
  }
}
