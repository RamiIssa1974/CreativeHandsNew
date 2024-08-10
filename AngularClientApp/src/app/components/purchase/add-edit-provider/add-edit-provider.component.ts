import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IProvider } from '../../../Model/IProvider';
import { AuthService } from '../../../services/auth.service';
import { PurchaseService } from '../../../services/purchase.service';

@Component({
  selector: 'app-add-edit-provider',
  templateUrl: './add-edit-provider.component.html',
  styleUrls: ['./add-edit-provider.component.css']
})
export class AddEditProviderComponent implements OnInit {
  isLoading: boolean = false;
  providerId: number = -1;
  provider: IProvider | null = null;
  errorMessage = 'OK';
  providerForm: FormGroup = new FormGroup({});

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }


  get providersId(): FormControl {
    return this.providerForm.get('Id') as FormControl;
  }
  get providersName(): FormControl {
    return this.providerForm.get('Name') as FormControl;
  }
  get providersIdN(): FormControl {
    return this.providerForm.get('IdN') as FormControl;
  }

  get providersTel1(): FormControl {
    return this.providerForm.get('Tel1') as FormControl;
  }
  get providersTel2(): FormControl {
    return this.providerForm.get('Tel2') as FormControl;
  }

  get providersAddress(): FormControl {
    return this.providerForm.get('Address') as FormControl;
  }
  get providersEmail(): FormControl {
    return this.providerForm.get('Email') as FormControl;
  }
  get providersDescription(): FormControl {
    return this.providerForm.get('Description') as FormControl;
  }
  get providersWebSite(): FormControl {
    return this.providerForm.get('WebSite') as FormControl;
  }
  get providersIsActive(): FormControl {
    return this.providerForm.get('IsActive') as FormControl;
  }
  constructor(private route: ActivatedRoute,
    private purchaseServices: PurchaseService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (!(this.isLoggedIn && this.isAdmin)) {
      const redirectUrl = this.authService.redirectUrl || '/'; // Default redirect URL
      this.router.navigateByUrl(redirectUrl);
    }
    this.providerForm = this.getEmptyForm();
    this.route.params.subscribe(params => {
      this.providerId = params['id'];

      if (this.providerId != null) {
        this.purchaseServices.getProviders().subscribe({
          next: providers => {
            this.provider = providers.find(pr => pr.Id == this.providerId) || null;
            if (this.provider) {
              this.providerForm = this.getFormFromProvider(this.provider);
            }
            else {
              this.providerForm = this.getEmptyForm();
            }
          },
          error: err => this.errorMessage = err
        });
      }
      else {
        this.providerForm = this.getEmptyForm();
      }
    });
  }


  getEmptyForm() {
    return this.fb.group({
      Id: [{ value: 0, disabled: true }],
      Name: ["", [Validators.required, Validators.minLength(3)]],
      IdN: "",
      Tel1: ["", [Validators.required, Validators.minLength(9)]],
      Tel2: "",
      Address: "",
      Email: "",
      Description: "",
      WebSite: "",
      IsActive: "",
    });
  }

  getFormFromProvider(provider: IProvider) {
    var formGroup = this.fb.group({
      Id: [{ value: provider.Id, disabled: true }],
      Name: [provider.Name, [Validators.required, Validators.minLength(3)]],
      IdN: provider.IdN,
      Tel1: [provider.Tel1, [Validators.required, Validators.minLength(9)]],
      Tel2: provider.Tel2,
      Address: provider.Address,
      Email: provider.Email,
      Description: provider.Description,
      WebSite: provider.WebSite,
      IsActive: provider.IsActive
    });

    return formGroup;
  }




  saveProvider() {
    this.isLoading = true;

    let request: IProvider = {
      Id: this.providersId.value,
      Name: this.providersName.value,
      IdN: this.providersIdN.value,
      Tel1: this.providersTel1.value,
      Tel2: this.providersTel2.value,
      Address: this.providersAddress.value,
      Email: this.providersEmail.value == null ? "" : this.providersEmail.value,
      Description: this.providersDescription.value == null ? "" : this.providersDescription.value,
      WebSite: this.providersWebSite.value,
      IsActive: this.providersIsActive.value
    };

    this.purchaseServices.saveProvider(request).subscribe(
      provId => {
        this.isLoading = false;
        this.router.navigateByUrl('/provider/' + provId);

      });
  }
}
