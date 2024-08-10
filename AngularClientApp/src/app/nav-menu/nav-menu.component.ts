import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ICategory } from '../Model/ICategory';
import { AuthService } from '../services/auth.service';
import { FilterService } from '../services/filter.service';
import { OrdersService } from '../services/orders.service';
import { ProductsService } from '../services/products.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  categories: ICategory[] = [];
  showCartIcon: boolean = true;
  isProductsListPage: boolean = false;
  cartQuantity: number = 0;
  filterText: string = "";
  isExpanded = false;
  get isMobile(): boolean {
    return window.innerWidth < 768;
  }
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }
  get Categories(): ICategory[] {
    return this.categories;
  }
  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FilterService,
    private orderService: OrdersService,
    private productServices: ProductsService) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.showCartIcon = !this.router.url.includes("cart") && !this.router.url.includes("login");
        this.isProductsListPage = this.router.url.includes("products-list");
        this.loadCartQuantity();
      });
  }
  ngOnInit(): void {
    //let path = location.pathname;
    this.orderService.cartQuantityOBS.subscribe(quantity => {
      this.cartQuantity = quantity;
    });
    this.productServices.getCategories().subscribe({
      next: cats => this.categories = cats
    });
  }//End of ngOnInit
 
  private loadCartQuantity() {
    this.orderService.loadCartQuantity();   
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  logOut() {
    //console.log("Logging out");
    this.authService.logout();
    this.router.navigate(['/']);
  }

  updateFilterVal() {
    this.router.navigate(['/products-list/-1/' + this.filterText]);
  }
  clear() {
    this.filterText = "";
  }
}
