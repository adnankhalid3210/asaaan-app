import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { BecomeSellerComponent } from './become-seller.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerificationComponent } from './verification/verification.component';
import {  FormsModule } from '@angular/forms';

export const routes = [
  { path: '', component: BecomeSellerComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [BecomeSellerComponent, VerificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    
    
  ],
  entryComponents: [VerificationComponent]
})
export class BecomeSellerModule { }
