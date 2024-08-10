import { ICategory } from './ICategory';
import { IProductVariation } from './IProductVariation';

export interface IProduct {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  SalePrice: number;
  Barcode: string;
  CategoryId: number;
  SubCategoryId: number;
  Categories: ICategory[];
  ProductVariations: IProductVariation[];
  Images:string[];
  StockQuantity: number;
  AvailableColours: string[];
}

export function createDefaultProduct(): IProduct {
  return {
    Id: 0,
    Name: '',
    Description: '',
    Price: 0,
    SalePrice: 0,
    Barcode: '',
    CategoryId: 0,
    SubCategoryId: 0,
    Categories: [],
    ProductVariations: [],
    Images: [],
    StockQuantity: 0,
    AvailableColours: []
  };
}
 
