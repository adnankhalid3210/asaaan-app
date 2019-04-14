import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../../../auth.service';
import * as firebase from 'firebase';
import { environment } from '../../../../environments/environment';
import { MessagingService } from '../../../messaging.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  counter$: Observable<number>;
  count = 60;
  btnDisable: boolean = false;
  modalTitle: string;
  modalPhone: string;
  myCounter = 60;
  user: any;

  windowRef: any;
  verificationCode: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public auth: AuthService, public message: MessagingService, public snackBar: MatSnackBar) {
    this.modalTitle = data.title;
    this.modalPhone = data.user.phone;
    console.log(data.user, 'Hey')
  }

  ngOnInit() {
    console.log('Verify ngoninit')
    // firebase.initializeApp(environment.config);
    this.windowRef = this.auth.windowRef()
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
      }
    });
    this.sendLoginCode();
  }

  disableResend() {
    this.count = 60;
    this.btnDisable = !this.btnDisable;
    this.counter$ = timer(0, 1000).pipe(
      take(this.count),
      map(() => --this.count)
    );
    setTimeout(() => this.btnDisable = !this.btnDisable, 60000)
  }


  sendLoginCode() {
    console.log('Verify SendLogin')
    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = this.modalPhone.replace('0', '+92');

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        console.log(result)

        this.windowRef.confirmationResult = result;

      })
      .catch(error => console.log(error));
  }


  submitCode() {
    console.log(this.verificationCode);
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        console.log(result)
        this.auth.resgister(this.data.user).subscribe((result: any) => {
          this.auth.saveUser(result.user, result.token);
          this.auth.changeState(true);
          this.router.navigate(['/account']);
          this.message.notificationsInit(result.user.phone)
        })
        // this.user = result.user;
      })
      .catch(error => {
        this.snackBar.open('Incorrect code entered!', '×', { panelClass: 'danger', verticalPosition: 'top', duration: 3500 });
        console.log(error, "Incorrect code entered?");
      })
  }
}
