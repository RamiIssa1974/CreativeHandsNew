import { ICustomer } from "./ICustomer";
import { IOrderItem } from "./IOrderItem";

export interface IOrder {
  Id: number,  
  StatusId: number,
  DeleveryPrice: number,
  CreateDate: Date,
  Address: string,
  Notes: string,
  Discount: number,
  Customer: ICustomer,
  OrderItems: IOrderItem[]
}
