 export interface IAddToCartRequest {
  UserId: string;
  OrderId: number;
  ProductId: number;
  ProductVariationId?: number;
  Quantity: number;
  ProductPrice: number;
  ProductSalePrice: number;
  ProductUnitPrice: number;
  OrderItemColours: string[];
  Note: string;
}
