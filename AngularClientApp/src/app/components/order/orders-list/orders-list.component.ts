import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { IOrder } from '../../../Model/IOrder';
import { IOrderSearchRequest } from '../../../Model/Requests/IOrderSearchRequest';
import { AuthService } from '../../../services/auth.service';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  showSaveSuccessMessage:boolean = false;
  isLoading = true;
  isMobileResolution: boolean;
  selectStatusId: number = 2;
  customerNameFilter: string = "";
  customerTelFilter: string = "";
  private ordersListBS$ = new BehaviorSubject<IOrder[]>([]);
  ordersList$ = this.ordersListBS$.asObservable();
  ordersList: IOrder[]= [];

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  constructor(private ordersService: OrdersService, private authService: AuthService) {
    if (window.innerWidth < 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  ngOnInit() {
    let request: IOrderSearchRequest = { OrderId: -1, CustomerId: -1, StatusId: this.selectStatusId, CustomerName: "", CustomerTel: "" };    
    this.ordersService.getOrders(request).subscribe(orders => {
      this.ordersList = orders;
      this.ordersListBS$.next(this.ordersList);
      this.isLoading = false;
    });
  }

  getOrderTotal(order: IOrder) {
    return order.OrderItems.map(oi => oi.Quantity * oi.UnitPrice).reduce((a, b) => a + b, 0);
  }
  filterByStatus(statusId:number) {
    this.isLoading = true;
    this.selectStatusId = statusId;

    //let filterdOrders: IOrder[] = this.ordersList.filter(ord => ord.StatusId == this.selectStatusId || this.selectStatusId == 0);
    //this.ordersListBS$.next(filterdOrders);
    let request: IOrderSearchRequest = {
      OrderId: -1,
      CustomerId: -1,
      CustomerName: "",
      CustomerTel: "",
      StatusId: this.selectStatusId
    };
    this.ordersService.getOrders(request).subscribe(orders => {
      this.ordersList = orders;
      this.ordersListBS$.next(this.ordersList);
      this.isLoading = false;
    });
  }
  filterByCustomerName() {    
    let filterdOrders: IOrder[] = this.ordersList.filter(ord => ord.Customer.Name.toLowerCase().includes(this.customerNameFilter.toLowerCase()) || this.customerNameFilter == "");
    this.ordersListBS$.next(filterdOrders);

  }
  filterByCustomerTel() {

    let filterdOrders: IOrder[] = this.ordersList.filter(ord => ord.Customer.Tel1 == this.customerTelFilter || ord.Customer.Tel2 == this.customerTelFilter || this.customerTelFilter == "");
    this.ordersListBS$.next(filterdOrders);
  }

  cleanFilters() {
    this.customerNameFilter = "";
    this.customerTelFilter = "";
    this.selectStatusId = 0;

    this.ordersListBS$.next(this.ordersList);
  }
  getOrders() {
    this.isLoading = true;
    let request: IOrderSearchRequest = {
      OrderId: -1, CustomerId: -1,
      StatusId: this.selectStatusId,
      CustomerName: this.customerNameFilter,
      CustomerTel: this.customerTelFilter
    };
    this.ordersService.getOrders(request).subscribe(orders => {
      this.ordersList = orders;
      this.ordersListBS$.next(this.ordersList);
      this.isLoading = false;
    });
  }
  statusList = [
  { "Id": 1, "Status": " سلة مشتريات" },
  { "Id": 2, "Status": " قيد الانتظار" },
  { "Id": 3, "Status": " جاهزه" },
  { "Id": 4, "Status": " ارسلت" },
  { "Id": 5, "Status": " مدفوع" },
  { "Id": 6, "Status": " ملغي" },
  { "Id": 7, "Status": " تامه" }];
  
  getStatusById(id: number): string | undefined {
    const status = this.statusList.find(st => st.Id == id);
    return status ? status.Status : undefined; // Return undefined if status is not found
  }
  
  changeOrderStatus(order: IOrder, orderStatusId: number) {
    this.isLoading = true;
    order.StatusId = orderStatusId;
    this.ordersService.changeOrderStatus(order).subscribe(ord => {
      this.isLoading = false;
      this.showSaveSuccessMessage = true;
      setTimeout(() => {
        this.showSaveSuccessMessage = false;
      }, 2000);
      this.getOrders();
    });
  }
}
