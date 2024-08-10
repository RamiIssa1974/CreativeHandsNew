import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AddEditProductComponent } from "./components/add-edit-product/AddEditProductComponent";
import { ProductsListComponent } from './components/products-list/products-list.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LoginComponent } from "./components/login/login.component";
import { MessageComponent } from './components/message/message.component';

import { OrderModule } from './components/order/order.module';
import { CategoriesComponent } from './components/categories/categories.component';

import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { PurchaseListComponent } from './components/purchase/purchase-list/purchase-list.component';
import { AddEditPurchaseComponent } from './components/purchase/add-edit-purchase/add-edit-purchase.component';
import { AddEditProviderComponent } from './components/purchase/add-edit-provider/add-edit-provider.component';
import { VideosComponent } from './components/videos/videos.component';
import { AddVideoComponent } from './components/add-video/add-video.component';
import { ColorPickerModule } from 'ngx-color-picker';
 
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,    
    AddEditProductComponent,
    ProductsListComponent,
    FileUploadComponent,
    LoginComponent,
    MessageComponent,
    CategoriesComponent,
    ProductDetailsComponent,
    PurchaseListComponent,
    AddEditPurchaseComponent,
    AddEditProviderComponent,
    VideosComponent,
    AddVideoComponent    
  ],
  imports: [
    OrderModule,
    ColorPickerModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,   
    CommonModule, 
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },      
      { path: 'login', component: LoginComponent },
      { path: 'add-product', component: AddEditProductComponent },
      { path: 'add-product/:id', component: AddEditProductComponent },
      { path: 'products-list/:id', component: ProductsListComponent },
      { path: 'products-list/:id/:search', component: ProductsListComponent },
      { path: 'purchase-list', component: PurchaseListComponent },
      { path: 'purchase', component: AddEditPurchaseComponent },
      { path: 'purchase/:id', component: AddEditPurchaseComponent },
      { path: 'provider', component: AddEditProviderComponent },
      { path: 'provider/:id', component: AddEditProviderComponent },
      { path: 'videos', component: VideosComponent },
      { path: 'add-video', component: AddVideoComponent },
      { path: 'add-video/id', component: AddVideoComponent },
      { path: '**', redirectTo: 'index.html', pathMatch:'full' }
    ], { useHash: true })
  ],
  providers: [    
  ],// [CookieService],

  bootstrap: [AppComponent]
})
export class AppModule { }
