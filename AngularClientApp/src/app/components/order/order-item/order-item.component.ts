import { Component, Input, OnInit, Output, EventEmitter, Renderer2 } from '@angular/core';
import { IOrderItem } from '../../../Model/IOrderItem';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  isMobile: boolean = false;
  unitPrice: number = 0;
  clickedImage: HTMLImageElement | null = null;//HTMLImageElement;
  @Input() isSmallView: boolean = false;
  @Input() itemIndex: number = 0;
  @Input() orderItem: IOrderItem | null = null;
  @Output() orderItemQuantityChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() orderItemUnitPriceChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() orderItemDeleted: EventEmitter<number> = new EventEmitter<number>();

  constructor(private authService: AuthService, private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      //let isSelected = false;
      //if (e.target == this.clickedImage) {
      //  isSelected = (event.target as HTMLDivElement).classList.contains("selected-image-div");
      //}
      let selectedImages = document.querySelector("img.selected-image-div") as HTMLImageElement | null;
      if (selectedImages) {
        selectedImages.classList.remove("selected-image-div");
      }
    });
  }

  ngOnInit() {
    if (this.orderItem) {
      this.unitPrice = this.orderItem.UnitPrice;
    } else {
      console.error('Order item is not defined');
    }

    this.isMobile = window.innerWidth < 768;
  }
  incQuantity(curVal: number) {
    this.orderItemQuantityChanged.emit(curVal + 1);
  }
  decQuantity(curVal: number) {
    if (curVal > 0) {
      this.orderItemQuantityChanged.emit(curVal - 1);
    }
  }

  changeQuantity(val: number) {
    this.orderItemQuantityChanged.emit(val);
  }
  changeUnitPrice() {
    this.orderItemUnitPriceChanged.emit(this.unitPrice);
  }
  deleteOrderItem(orderId: number) {
    this.orderItemDeleted.emit(orderId);
  }
    
  changeSelectedImageClass(event:Event) {
    let isSelected = false;
    if (event.target == this.clickedImage) {
      isSelected = (event.target as HTMLDivElement).classList.contains("selected-image-div");
    }
    this.clickedImage = event.target as HTMLImageElement;
    let selectedImages = document.querySelector("img.selected-image-div") as HTMLImageElement | null;
    if (selectedImages) {
      selectedImages.classList.remove("selected-image-div");
    }
    if (!isSelected) {
      (event.target as HTMLImageElement).classList.add("selected-image-div");
    }
  }
}
