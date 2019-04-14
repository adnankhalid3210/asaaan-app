import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { emailValidator, matchingPasswords, phoneValidator } from '../../theme/utils/app-validators';
import { AuthService } from '../../auth.service';
import { AppError } from '../../shared/common/app-error';
import { NotFound } from '../../shared/common/not-found';
import { BadRequest } from '../../shared/common/bad-request';
import { MatDialogConfig } from '@angular/material';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { MessagingService } from '../../messaging.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, public auth: AuthService, public dialog: MatDialog, public message: MessagingService) { }

  ngOnInit() {
    this.auth.logInState.pipe(take(1)).subscribe(isLogin => {
      if (isLogin) {
        this.router.navigate(['/account'])
      }
    })
    this.loginForm = this.formBuilder.group({
      'phone': ['', Validators.compose([Validators.required, phoneValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });

    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'phone': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    }, { validator: matchingPasswords('password', 'confirmPassword') });

  }

  public onLoginFormSubmit(values: Object): void {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe(
        (result: any) => {
          this.auth.changeState(true);
          this.auth.saveUser(result.user, result.token)
          let hiring = localStorage.getItem('hiring');
          if(hiring) {
            // localStorage.removeItem('sp');
            this.router.navigate(['/checkout']) 
          } else {
             this.router.navigate(['/account']);
            }
          // this.router.navigate(['/account']);
        this.message.notificationsInit(result.user.phone);
        },
        (error: AppError) => {
          if (error instanceof NotFound) {
            this.loginForm.get('phone').setErrors({
              invalidPhone: true
            });
          } else if (error instanceof BadRequest) {
            this.loginForm.get('password').setErrors({
              invalidPass: true
            });
          } else {
          }

        })
    }
  }

  public onRegisterFormSubmit(values: Object): void {
    if (this.registerForm.valid) {
      this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

  // this.openModal()



  dialogRef;
  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Forgot Password'
    };
    this.dialogRef = this.dialog.open(ForgotpasswordComponent, dialogConfig);

  }
  closeModal() {
    this.dialogRef.close();
  }






}
