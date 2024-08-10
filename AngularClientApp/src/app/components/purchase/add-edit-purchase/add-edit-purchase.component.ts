import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IProvider } from '../../../Model/IProvider';
import { IPurchase } from '../../../Model/IPurchase';

import { CustomValidator } from '../../../Model/Validators/CustomValidators';
import { AuthService } from '../../../services/auth.service';
import { PurchaseService } from '../../../services/purchase.service';
import { parseInt } from 'lodash';

@Component({
  selector: 'app-add-edit-purchase',
  templateUrl: './add-edit-purchase.component.html',
  styleUrls: ['./add-edit-purchase.component.css'],
  providers: [DatePipe]
})
export class AddEditPurchaseComponent implements OnInit {
  newFiles: string[] = [];
  deletedFiles: string[] = [];
  isLoading: boolean = false;
  purchaseId: number = -1;
  purchase: IPurchase | undefined;
  fileToUpload: File | undefined;
  selectedfileName: string = "please select a file";
  errorMessage = 'OK';
  purchaseForm: FormGroup = new FormGroup({});
  providersList: IProvider[] = [];

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get fileUploader(): FormArray {
    //console.log(JSON.stringify(this.productForm.controls['file_uploaders']));
    return this.purchaseForm.controls['file_uploader'].value;
  };
  get purchasesImage(): FormControl {
    return this.purchaseForm.get('Image') as FormControl;
  }

  get purchasesId(): number {
    const val = this.purchaseForm.get('Id');
    return val ? (val.value ?? -1) : -1;
  }


  get purchasesProviderId(): FormControl {
    return this.purchaseForm.get('ProviderId') as FormControl;
  }

  get purchasesAmount(): FormControl {
    return this.purchaseForm.get('Amount') as FormControl;
  }

  get purchasesDate(): FormControl {
    return this.purchaseForm.get('CreateDate') as FormControl;
  }

  get purchasesDescription(): string {
    const val = this.purchaseForm.get('Description');
    return val ? (val.value ?? '') : '';
  }
  get purchasesPurchaseLink(): FormControl {
    return this.purchaseForm.get('PurchaseLink') as FormControl;
  }

  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private purchaseServices: PurchaseService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (!(this.isLoggedIn && this.isAdmin)) {
      this.router.navigateByUrl(this.authService.redirectUrl || '/default-url');
    }

    this.purchaseServices.getProviders().subscribe(providers => {
      this.providersList = providers
    });
    this.purchaseForm = this.getEmptyForm();
    this.route.params.subscribe(params => {
      this.purchaseId = params['id'];

      if (this.purchaseId != null) {
        this.purchaseServices.getPurchaseById(this.purchaseId).subscribe({
          next: purchase => {
            this.purchaseId = purchase.Id;
            this.purchase = purchase;
            this.purchaseForm = this.getFormFromPurchase(this.purchase);
          },
          error: err => this.errorMessage = err
        });
      }
      else {
        this.purchaseForm = this.getEmptyForm();
      }
    });
  }

  onSelectFile(files: FileList) {
    //console.log("url" + JSON.stringify(files[0]));
    this.selectedfileName = files[0].name;
    this.fileToUpload = files[0];
    this.purchaseForm.controls['Image'].setValue(files[0].name);
    this.purchaseForm.controls['Image'].updateValueAndValidity();
    this.purchaseForm.updateValueAndValidity();
  }
  deleteFile(filename: string, index: number) {
    this.purchaseForm.controls['Image'].setValue("");
    //this.fileToUpload.slice(index, 1);
    this.purchaseForm.controls['Image'].updateValueAndValidity();
    this.purchaseForm.updateValueAndValidity();
  }

  getEmptyForm() {
    return this.fb.group({
      Id: [{ value: 0, disabled: true }],
      ProviderId: ["", [Validators.required]],
      Amount: ["", [Validators.required, Validators.min(0.01), CustomValidator.numeric]],
      CreateDate: ["", [Validators.required]],
      Description: "",
      PurchaseLink: "",
      Image: ["", [Validators.required]]
    });
  }

  getFormFromPurchase(purchse: IPurchase) {
    var formGroup = this.fb.group({
      Id: [{ value: purchse.Id, disabled: true }],
      ProviderId: [purchse.ProviderId, [Validators.required]],
      Amount: [purchse.Amount, [Validators.required, Validators.min(0.01), CustomValidator.numeric]],
      CreateDate: [purchse.CreateDate, [Validators.required]],
      Description: purchse.Description,
      PurchaseLink: purchse.PurchaseLink,
      Image: [purchse.Image, [Validators.required]]
    });
    return formGroup;
  }

  savePurchase() {
    this.isLoading = true;
    let request: IPurchase = {
      Id: this.purchasesId,
      ProviderId: parseInt(this.purchasesProviderId.value),
      Description: this.purchasesDescription,
      Amount: parseFloat(this.purchasesAmount.value) || 0,
      CreateDate: this.purchasesDate.value,
      PurchaseLink: this.purchasesPurchaseLink.value,
      Image: this.purchasesImage == null ? "" : this.purchasesImage.value,
      Provider: null
    };

    this.purchaseServices.savePurchase(request).subscribe(
      purchaseId => {
        if (purchaseId > 0) {
          if (this.fileToUpload) {
            this.purchaseServices.uploadFile(this.fileToUpload, purchaseId).subscribe(saveRes => {
              this.isLoading = false;
              this.router.navigateByUrl('/purchase/' + purchaseId);
            });
          }
          else {
            this.isLoading = false;
          }
        }
      });
  }
}
