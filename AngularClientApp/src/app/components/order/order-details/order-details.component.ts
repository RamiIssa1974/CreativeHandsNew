import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from '../../../Model/IOrder';
import { AuthService } from '../../../services/auth.service';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  orderId: number = 0;
  order: IOrder | null = null;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get OrderTotal(): number {
    if (!this.order || !this.order.OrderItems) {
      return 0; // or any default value that makes sense
    }
  
    return this.order.OrderItems
      .map(oi => oi.Quantity * oi.UnitPrice)
      .reduce((a, b) => a + b, 0);
  }
  constructor(private orersService: OrdersService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.url.subscribe(url => {
      let path = url[0].path;
      if (path === "cart") {
        this.orersService.getCart().subscribe(res => {
          this.orderId = res.Id;
          this.order = res;
        });
      }
      else {
        this.route.params.subscribe(params => {
          this.orderId = params['id'];
          this.orersService.getOrderById(this.orderId).subscribe(res => this.order = res);
        });
      }

    });


  }

}
