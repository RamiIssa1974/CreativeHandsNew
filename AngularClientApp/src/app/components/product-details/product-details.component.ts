import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { IOrderItem } from '../../Model/IOrderItem';
import { IProduct } from '../../Model/IProduct';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  selctedColours: string[] = [];
  selected: boolean = false;
  showAddedToCartMessage = false;

  @Input() product?: IProduct; // Use optional chaining to handle undefined

  constructor(private orderService: OrdersService, private el: ElementRef) { }

  ngOnInit(): void {
    // Initialization logic here
  }

  showImage(ind: number): void {
    if (this.product && ind >= 0 && ind < this.product.Images.length) {
      const elms = document.querySelectorAll<HTMLElement>(".current-image");
      const elentToShow = elms[ind];
      
      elms.forEach((itm) => {
        itm.style.display = 'none';
      });

      elentToShow.style.display = 'block';
    }
  }

  incAddProdQuantity(elm: HTMLInputElement): void {
    if (elm && elm.value) {
      elm.value = (parseInt(elm.value) + 1).toString();
    }
  }

  decAddProdQuantity(elm: HTMLInputElement): void {
    if (elm && elm.value && parseInt(elm.value) > 1) {
      elm.value = (parseInt(elm.value) - 1).toString();
    }
  }

  addToCart(product: IProduct, quantity: number, selectedPrice: HTMLInputElement | null): void {
    let productVariationsDiv: HTMLDivElement | null = null;
    if (product.ProductVariations.length > 0) {
      const id = `productVariations${product.Id}Div`;
      productVariationsDiv = document.querySelector(`#${id}`) as HTMLDivElement;

      if (!selectedPrice) {
        productVariationsDiv?.classList.remove("hidden");
        return;
      }
    }

    const prodVar = product.ProductVariations.find(x => x.Id.toString() == selectedPrice?.value);
    const orderItem: IOrderItem = {
      Id: -1,
      OrderId: -1,
      UnitPrice: prodVar ? prodVar.Price : -1,
      Quantity: quantity,
      Note: "",
      ProductVariation: prodVar??null,
      Product: product,
      Colours: this.selctedColours
    };

    this.orderService.addToCart(orderItem).subscribe(orderId => {
      this.selctedColours = [];
      this.orderService.updateCartQuantity(orderItem.Quantity);
      productVariationsDiv?.classList.add("hidden");
    });

    this.showAddedToCartMessage = true;
    setTimeout(() => {
      this.showAddedToCartMessage = false;
    }, 3000);
  }

  closeDiv(productId: number): void {
    const id = `productVariations${productId}Div`;
    const productVariationsDiv = document.querySelector(`#${id}`) as HTMLDivElement;
    productVariationsDiv?.classList.add("hidden");
  }

  changeSelectedProductVariation(product: IProduct, selectedPrice: number, prodQuantity: HTMLInputElement, varTotal: HTMLInputElement): void {
    const prodVar = product.ProductVariations.find(x => x.Id == selectedPrice);
    if (prodVar) {
      varTotal.value = (prodVar.Price * parseInt(prodQuantity.value)).toString();
    }
  }

  incAddProdVarQuantity(product: IProduct, selectedPrice: HTMLInputElement, prodQuantity: HTMLInputElement, varTotal: HTMLInputElement): void {
    if (prodQuantity && selectedPrice) {
      prodQuantity.value = (parseInt(prodQuantity.value) + 1).toString();
      const prodVar = product.ProductVariations.find(x => x.Id.toString() == selectedPrice.value);
      if (prodVar) {
        varTotal.value = (prodVar.Price * parseInt(prodQuantity.value)).toString();
      }
    }
  }

  decAddProdVarQuantity(product: IProduct, selectedPrice: HTMLInputElement, prodQuantity: HTMLInputElement, varTotal: HTMLInputElement): void {
    if (prodQuantity && parseInt(prodQuantity.value) > 1) {
      prodQuantity.value = (parseInt(prodQuantity.value) - 1).toString();
      const prodVar = product.ProductVariations.find(x => x.Id.toFixed() == selectedPrice.value);
      if (prodVar) {
        varTotal.value = (prodVar.Price * parseInt(prodQuantity.value)).toString();
      }
    }
  }

  closeProductDetailsPopup(): void {
    const productPopup = document.querySelector(".popup") as HTMLDivElement;
    productPopup.hidden = true;
    const modalBackdrop = document.querySelector(".modal-backdrop") as HTMLDivElement;
    modalBackdrop.style.display = "none";
  }

  selectColour(event: Event, colour: string): void {
    const target = event.target as HTMLElement;
    const hasClass = target.classList.contains('selected');
    if (hasClass) {
      target.classList.remove('selected');
      this.selctedColours = this.selctedColours.filter(clr => clr !== colour);
    } else {
      target.classList.add('selected');
      this.selctedColours.push(colour);
    }
  }
}
