import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  constructor() { }

  private productFilterBS$ = new BehaviorSubject<string>("");
  productFilterOBS = this.productFilterBS$.asObservable();

  public setProductFiltera(filterStr: string) {
    console.log("Setting value to Behaviour Subject: " + filterStr);
    this.productFilterBS$.next(filterStr);
  }

  private newProductFilterBS$ = new BehaviorSubject<string>("");
  newProductFilterOBS = this.newProductFilterBS$.asObservable();

  public setNewProductFilter(filterStr: string) {    
    this.newProductFilterBS$.next(filterStr);
  }
   
}
