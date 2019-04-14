import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SignInComponent } from './sign-in.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

export const routes = [
  // { path: '', component: SignInComponent, pathMatch: 'full' },
  // { path: 'reset', component: ResetpasswordComponent, pathMatch: 'full' }
  { path: '', component: SignInComponent },
  { path: 'reset/:id', component: ResetpasswordComponent, data: { breadcrumb: 'Reset Password' }}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    SignInComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent
  ],
  entryComponents: [ForgotpasswordComponent]
})
export class SignInModule { }
