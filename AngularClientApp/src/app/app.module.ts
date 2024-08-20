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
import { AppRoutingModule } from './app-routing.module';
 
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
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ColorPickerModule,
    AppRoutingModule // Use AppRoutingModule for routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
