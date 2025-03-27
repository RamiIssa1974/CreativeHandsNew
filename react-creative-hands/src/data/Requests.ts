 export type GetOrderRequest = {
    OrderId: number;
    CustomerId: number;
    CustomerName: string;
    CustomerTel: string;
    StatusId: number;
     
};

export type GetProductRequest = {
    Id: number;
    Name: string;
    Description: string;
    Barcode: string;
    CategoryId: number;
    SubCategoryId: number;
};

export interface AddToCartRequest {
    UserId: string;
    ProductId: number;
    ProductVariationId?: number;
    Quantity: number;
    ProductPrice: number;
    ProductSalePrice: number;
    ProductUnitPrice: number;
    OrderId: number;
    Note: string;
    OrderItemColours?: string[];
}

export interface SendOrderRequest {
    OrderId: number;
    UserID: string;
    CustomerName: string;
    CustomerTel: string;
    Address: string;
    Notes: string;
}
