import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { IOrder } from '../../../Model/IOrder';
import { IProvider } from '../../../Model/IProvider';
import { IPurchase } from '../../../Model/IPurchase';
import { IGetPurchaseRequest } from '../../../Model/Requests/IGetPurchaseRequest';
import { IOrderSearchRequest } from '../../../Model/Requests/IOrderSearchRequest';
import { AuthService } from '../../../services/auth.service';
import { OrdersService } from '../../../services/orders.service';
import { PurchaseService } from '../../../services/purchase.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css'],
  providers: [DatePipe]
})
export class PurchaseListComponent implements OnInit {
  providersList: IProvider[] = [];
  showSaveSuccessMessage = false;
  isLoading = true;
  isMobileResolution: boolean;
  selectProviderId: number = -1;
  fromDateFilter: string = "";
  toDateFilter: string = "";
  private purchasesListBS$ = new BehaviorSubject<IPurchase[]>([]);
  purchasesList$ = this.purchasesListBS$.asObservable();
  purchsesList: IPurchase[] = [];

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  constructor(private purchaseServices: PurchaseService, private authService: AuthService) {
    if (window.innerWidth < 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }
 
  ngOnInit() {
    this.purchaseServices.getProviders().subscribe(providers => {
      this.providersList = providers
    });
    let request: IGetPurchaseRequest = { Id: -1, ProviderId: -1, FromDate: '', ToDate: '' };
    this.purchaseServices.getPurchases(request).subscribe(purchases => {
      this.purchsesList = purchases.map(purchase => {
        // Find the provider by ProviderId
        const provider = this.providersList.find(p => p.Id === purchase.ProviderId) || null;
        return { ...purchase, Provider: provider };
      });;
      this.purchasesListBS$.next(this.purchsesList);
      this.isLoading = false;
    });
  }

  getPrchsesTotal(order: IOrder) {
    return this.purchsesList.map(oi => oi.Amount).reduce((a, b) => a + b, 0);
  }
  filterByProviderId(providerId: number) {
    this.isLoading = true;
    this.selectProviderId = providerId;

    let request: IGetPurchaseRequest = {
      Id: -1, ProviderId: this.selectProviderId, FromDate: '', ToDate: ''
    };
    this.purchaseServices.getPurchases(request).subscribe(purchases => {
      this.purchsesList = purchases;
      this.purchasesListBS$.next(this.purchsesList);
      this.isLoading = false;
    });
  }
  filterByFromDate() {
    let filterdPurchases: IPurchase[] = this.purchsesList.filter(pr => pr.CreateDate >= this.fromDateFilter || this.fromDateFilter == "");
    this.purchasesListBS$.next(filterdPurchases);
  }
  filterByToDate() {
    let filterdPurchases: IPurchase[] = this.purchsesList.filter(pr => pr.CreateDate <= this.toDateFilter || this.toDateFilter == "");
    this.purchasesListBS$.next(filterdPurchases);
  }

  cleanFilters() {
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.selectProviderId = -1;

    this.purchasesListBS$.next(this.purchsesList);
  }
  getPurchases() {
    this.isLoading = true;
    let request: IGetPurchaseRequest = {
      Id: -1, ProviderId: this.selectProviderId, FromDate: this.fromDateFilter, ToDate: this.toDateFilter

    };
    this.purchaseServices.getPurchases(request).subscribe(purchases => {
      this.purchsesList = purchases;
      this.purchasesListBS$.next(this.purchsesList);
      this.isLoading = false;
    });
  }

  setActive(elm: Event) {
    var target = elm.target as HTMLElement;
    if (target && target.parentElement) {
      if (!target.parentElement.classList.contains("active")) {
        target.parentElement.classList.add("active")
      }
      else {
        target.parentElement.classList.remove("active")
      }
    }
  }
}
