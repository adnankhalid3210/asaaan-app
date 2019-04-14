import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { phoneValidator } from '../../../theme/utils/app-validators';
import { AuthService } from '../../../auth.service';
import * as firebase from 'firebase';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  counter$: Observable<number>;
  count = 60;

  btnDisable: boolean = false;
  modalTitle: string;
  modalPhone: string;
  myCounter = 60;
  clicked = false;
  windowRef: any;
  id: string;

  forgotPassword: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public formBuilder: FormBuilder, public auth: AuthService) {
    this.modalTitle = data.title;
  }

  ngOnInit() {
    this.forgotPassword = this.formBuilder.group({
      'phone': ['', Validators.compose([Validators.required, phoneValidator])],
      'verificationCode': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  disableResend() {
    // Check if number exists
    if (this.forgotPassword.get('phone').valid)
      this.auth.isUnique(this.forgotPassword.get('phone').value).subscribe((result: any) => {
        if (result.message === "User not found.") {
          this.forgotPassword.get('phone').setErrors({ invalidPhone: true })
        } else {
          this.id = result.id;
          this.clicked = true;
          this.count = 60;
          this.btnDisable = !this.btnDisable;
          this.counter$ = timer(0, 1000).pipe(
            take(this.count),
            map(() => --this.count)
          );
          setTimeout(() => this.btnDisable = !this.btnDisable, 60000)
          // firebase.initializeApp(environment.config);
          this.windowRef = this.auth.windowRef()
          this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
            }
          });
          this.sendLoginCode();
        }
      })
  }

  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.forgotPassword.get('phone').value.replace('0', '+92');
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch(error => console.log(error));
  }

  submitCode() {
    this.windowRef.confirmationResult
      .confirm(this.forgotPassword.get('verificationCode').value)
      .then(result => {
        this.router.navigate(['sign-in/reset/' + this.id]);
        // })
      })
      .catch(error => console.log(error, "Incorrect code entered?"));
  }
}