import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyComponent } from './policy.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';


export const routes = [
  { path: '', component: PolicyComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [PolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PrivacyPolicyModule { }
