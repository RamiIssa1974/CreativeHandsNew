import { IProvider } from "./IProvider";


export interface IPurchase {
  Id: number;
  ProviderId: number;
  Provider: IProvider | null;
  Amount: number;
  CreateDate: string;
  Description: string;
  PurchaseLink: string;
  Image: string;
}

