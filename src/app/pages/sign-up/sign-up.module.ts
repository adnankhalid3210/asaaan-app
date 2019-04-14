import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationComponent } from './verification/verification.component';
import { SignUpComponent } from './sign-up.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: SignUpComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [VerificationComponent, SignUpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  entryComponents: [VerificationComponent]

})
export class SignUpModule { }
