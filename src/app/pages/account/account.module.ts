import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InformationComponent } from './information/information.component';
import { AddressesComponent } from './addresses/addresses.component';
import { OrdersComponent } from './orders/orders.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequestsComponent } from './requests/requests.component';
import { CustomerProfileComponent } from './requests/customer-profile/customer-profile.component';
import { EditPictureComponent } from './dashboard/edit-picture/edit-picture.component';

export const routes = [
  { 
      path: '', 
      component: AccountComponent, children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent, data: {  breadcrumb: 'Profile' } },
          { path: 'information', component: InformationComponent, data: {  breadcrumb: 'Settings' } },
          // { path: 'addresses', component: AddressesComponent, data: {  breadcrumb: 'Addresses' } },
          { path: 'orders', component: OrdersComponent, data: {  breadcrumb: 'Orders' } },
          { path: 'requests', component: RequestsComponent, data: {  breadcrumb: 'Service Request' } }

      ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule

  ],
  declarations: [
    AccountComponent,
    DashboardComponent,
    InformationComponent,
    AddressesComponent,
    OrdersComponent,
    RequestsComponent,
    CustomerProfileComponent,
    EditPictureComponent,
    
  ],
  entryComponents: [CustomerProfileComponent, EditPictureComponent]

})
export class AccountModule { }
