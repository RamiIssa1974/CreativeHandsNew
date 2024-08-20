import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  { path: 'orders-list', component: OrdersListComponent },
  { path: ':id', component: OrderComponent },
  { path: 'order-details/:id', component: OrderDetailsComponent },
  { path: 'cart', component: OrderComponent },
  { path: '', redirectTo: 'orders-list', pathMatch: 'full' },
  { path: 'RefreshComponent', component: OrderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
