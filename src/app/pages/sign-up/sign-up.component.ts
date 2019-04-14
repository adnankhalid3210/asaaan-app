import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { emailValidator, matchingPasswords, phoneValidator } from '../../theme/utils/app-validators';
import { AuthService } from '../../auth.service';
import { AppError } from '../../shared/common/app-error';
import { NotFound } from '../../shared/common/not-found';
import { BadRequest } from '../../shared/common/bad-request';
import { VerificationComponent } from 'src/app/pages/sign-up/verification/verification.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUp: FormGroup;

  constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, public auth: AuthService, public dialog: MatDialog) { }

  ngOnInit() {
    this.auth.logInState.pipe(take(1)).subscribe(isLogin => {
      if (isLogin) {
        this.router.navigate(['/account'])
      }
    })
    this.signUp = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'phone': ['', Validators.compose([Validators.required, phoneValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      'confirmPassword': ['', Validators.required]

    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }

  public onsignUpSubmit(values): void {
    if (this.signUp.valid) {
      this.auth.isUnique(values.phone).subscribe((result: any) => {
        if(result.message === "User not found.") {
          this.openModal();
        } else {
          this.signUp.get('phone').setErrors({ notUnique: true })
        }
      })
    }
  }

  
  dialogRef;
  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      user: this.signUp.value,
      title: 'Verify your phone number'
    };
    this.dialogRef = this.dialog.open(VerificationComponent, dialogConfig);

  }
  closeModal() {
    this.dialogRef.close();
  }

}
