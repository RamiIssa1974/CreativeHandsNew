import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AddEditProductComponent } from './components/add-edit-product/AddEditProductComponent';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { PurchaseListComponent } from './components/purchase/purchase-list/purchase-list.component';
import { AddEditPurchaseComponent } from './components/purchase/add-edit-purchase/add-edit-purchase.component';
import { AddEditProviderComponent } from './components/purchase/add-edit-provider/add-edit-provider.component';
import { VideosComponent } from './components/videos/videos.component';
import { AddVideoComponent } from './components/add-video/add-video.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-product', component: AddEditProductComponent },
  { path: 'products-list/:id', component: ProductsListComponent },
  { path: 'purchase-list', component: PurchaseListComponent },
  { path: 'purchase', component: AddEditPurchaseComponent },
  { path: 'provider', component: AddEditProviderComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'add-video', component: AddVideoComponent },
  { path: 'order', loadChildren: () => import('./components/order/order.module').then(m => m.OrderModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
