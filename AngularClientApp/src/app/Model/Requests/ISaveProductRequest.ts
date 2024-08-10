import { IProductVariation } from "../IProductVariation";

export interface ISaveProductRequest {
  Id: number;
  Name: string;
  Description: string;
  Barcode: string;
  Price: number;
  SalePrice: number;
  Categories: number[];
  Images: string[];
  StockQuantity: number;
  UploadedImages: string[];
  ProductVariations: IProductVariation[];
  AvailableColours: string[];
}
