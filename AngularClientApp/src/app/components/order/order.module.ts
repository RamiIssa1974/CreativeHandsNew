import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { RouterModule } from '@angular/router';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderItemComponent } from './order-item/order-item.component';

@NgModule({
  declarations: [OrderComponent, OrdersListComponent, OrderDetailsComponent, OrderItemComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'orders-list', component: OrdersListComponent, pathMatch: 'full'},
      { path: 'order/:id', component: OrderComponent, pathMatch: 'full' },
      { path: 'order-details/:id', component: OrderDetailsComponent, pathMatch: 'full' },
      { path: 'cart', component: OrderComponent, pathMatch: 'full' },
      { path: 'RefreshComponent', component: OrderComponent, pathMatch: 'full' }
    ])
  ]
}) 
export class OrderModule { }
