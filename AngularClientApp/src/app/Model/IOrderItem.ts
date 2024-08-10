import { IProduct } from "./IProduct";
import { IProductVariation } from "./IProductVariation";

export interface IOrderItem {
  Id: number;
  OrderId: number;
  Product: IProduct;
  UnitPrice: number;
  Quantity: number;
  Note: string;
  ProductVariation: IProductVariation | null;
  Colours: string[];
}


