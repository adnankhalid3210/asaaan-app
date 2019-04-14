import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Data, AppService } from '../../app.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { IOrder } from '../../app.models';
import { MessagingService } from '../../messaging.service';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})


export class CheckoutComponent implements OnInit {
  hireForm: FormGroup;
  hired;
  user;
  receiver;
  constructor(public appService: AppService, public formBuilder: FormBuilder, public router: Router, public auth: AuthService, public message: MessagingService) { }

  ngOnInit() {
    this.hired = JSON.parse(localStorage.getItem('sp'))
    if (!this.hired) {
      this.router.navigate(['/']);
    }
    this.hireForm = this.formBuilder.group({
      address: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      description: ['', Validators.compose([Validators.required, Validators.minLength(20)])],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }
  onHireFormSubmit(value) {
    if (this.hireForm.valid) {
      this.auth.newUser.subscribe(user => {
        this.user = user;
      })
      let order: IOrder;
      order = {
        user: this.user.id,
        serviceProvider: this.hired.user.id,
        address: value.address,
        description: value.description,
        date: new Date(),
        hiringDate: value.date,
        time: value.time,
        category: this.hired.category.id,
        status: 'Pending'
      }
      this.auth.makeOrder(order).subscribe(res => {
        this.router.navigate(['account/orders']);
        this.message.getToken(this.hired.user.id).subscribe(res => {
          this.receiver = res;
          let notify = {
            "notification": {
              "title": "Hello" + ' ' + this.hired.user.name,
              "body": "You have a new order.",
              "icon": "https://res.cloudinary.com/dz8zgvu8s/image/upload/v1553258338/logo3.png"
            },
            "to": this.receiver
          }
          this.message.sendNotification(notify).subscribe(res => {
          })
        })
      })
    }
  }
  ngOnDestroy() {
    localStorage.removeItem('sp')
    localStorage.removeItem('hiring')
  }
  customTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#fff',
      buttonColor: '#53b995'
    },
    dial: {
      dialBackgroundColor: '#53b995',
    },
    clockFace: {
      clockFaceBackgroundColor: '#53b995',
      clockHandColor: '#9fbd90',
      clockFaceTimeInactiveColor: '#fff'
    }
  };
}
