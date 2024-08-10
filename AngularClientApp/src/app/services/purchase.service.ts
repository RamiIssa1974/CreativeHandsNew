import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { IProvider } from '../Model/IProvider';
import { IPurchase } from '../Model/IPurchase';
import { IGetPurchaseRequest } from '../Model/Requests/IGetPurchaseRequest';
import { IUploadFilesRespone } from '../Model/Responses/IUploadFilesResponse';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private getPurchasesUrl = environment.baseApiUrl + "api/purchases/GetPurchases";
  private getPurchaseByIdUrl = environment.baseApiUrl + "api/purchases/purchases";
  private savePurchaseUrl = environment.baseApiUrl + "api/purchases/purchase";//SavePurchase;

  private getProvidersUrl = environment.baseApiUrl + "api/purchases/GetProviders";
  private saveProviderUrl = environment.baseApiUrl + "api/purchases/purchase";
  private uploadPurchaseFileUrl = environment.baseApiUrl + "Api/UploadPurchaseFile";//"api/video/SaveVideo";

  constructor(private http: HttpClient) { }

  getPurchaseById(purchaseId: number): Observable<IPurchase> {
    return this.http.get<IPurchase>(this.getPurchaseByIdUrl + "?purchaseId=" + purchaseId.toString());
  }

  getPurchases(request: IGetPurchaseRequest): Observable<IPurchase[]> {
    if (!request.FromDate) {
      request.FromDate = '2000-01-01T00:00:00'; // or another default value
    }
    if (!request.ToDate) {
      request.ToDate = new Date().toISOString(); // current date as default
    }
    return this.http.post<IPurchase[]>(this.getPurchasesUrl, request);
  }

  savePurchase(purchase: IPurchase): Observable<number> {
    console.log("purchase data: ", purchase);
    return this.http.post<number>(this.savePurchaseUrl, purchase);
  }

  uploadFile(fileToUpload: File, purchaseId: number): Observable<IUploadFilesRespone> {
    const fd = new FormData();
    fd.append("file", fileToUpload, fileToUpload.name)
    fd.append("purchaseId", purchaseId.toString());
    return this.http.post<IUploadFilesRespone>(this.uploadPurchaseFileUrl, fd);
  }


  getProviders(): Observable<IProvider[]> {
    return this.http.get<IProvider[]>(this.getProvidersUrl);
  }

  saveProvider(request: IProvider): Observable<number> {
    return this.http.post<number>(this.saveProviderUrl, request);
  }
}
