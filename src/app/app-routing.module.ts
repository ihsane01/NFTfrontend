import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNftComponent } from './create-nft/create-nft.component';
import { HomeComponent } from './home/home.component';
import { MyListedItemsComponent } from './Items/my-listed-items/my-listed-items.component';
import { MyPurchasesComponent } from './Items/my-purchases/my-purchases.component';
import { AccountGuard } from './account.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"createNft",component:CreateNftComponent, canActivate:[AccountGuard]},
  {path:"myListedItems",component:MyListedItemsComponent, canActivate:[AccountGuard]},
  {path:"myPurchases",component:MyPurchasesComponent, canActivate:[AccountGuard] },
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full',
  // }, {
  //   path: '',
  //   component: AdminLayoutComponent,
  //   children: [{
  //     path: '',
  //     loadChildren: () => import('./layout/navbar/admin-layout/admin-layout.component').then(m => m.AdminLayoutModule)
  //   }]
  // }
  {path:"dashboard",component:DashboardComponent, canActivate:[AccountGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
