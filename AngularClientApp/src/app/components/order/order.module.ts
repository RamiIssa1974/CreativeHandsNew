import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderItemComponent } from './order-item/order-item.component';
import { OrderRoutingModule } from './order-routing.module'; // Import the routing module

@NgModule({
  declarations: [
    OrderComponent, 
    OrdersListComponent, 
    OrderDetailsComponent, 
    OrderItemComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
