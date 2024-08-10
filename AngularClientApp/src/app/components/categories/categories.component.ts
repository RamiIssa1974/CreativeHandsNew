import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../Model/ICategory';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: ICategory[] = [];

  get Categories(): ICategory[] {
    return this.categories;
  }
  constructor(private productServices: ProductsService) { }

  ngOnInit() {
    this.productServices.getCategories().subscribe({
      next: cats => {        
        this.categories = cats;
      }
    });
  }

}
