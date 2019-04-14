import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { MatDialog } from '@angular/material';
import { MatDialogConfig } from '@angular/material';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { ReviewComponent } from '../../../shared/review/review.component';
import { MessagingService } from '../../../messaging.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  requests;
  receiver;
  constructor(private auth: AuthService, public dialog: MatDialog, public message: MessagingService) { }

  ngOnInit() {
    this.auth.getHiringRequests().subscribe((res: any) => {
      this.requests = res.reverse();
    })
  }

  changeStatus(req, status) {
    req.status = status
    let request = {
      id: req.id,
      status: status
    }
    this.auth.updateOrder(request).subscribe(res => {
    })

    this.message.getToken(req.user.phone).subscribe(res => {
      this.receiver = res;
      let notify = {
        "notification": {
          "title": "Hello" + ' ' + req.user.name,
          "body": "Order has been" + status + ".",
          "icon": "https://res.cloudinary.com/dz8zgvu8s/image/upload/v1553258338/logo3.png"
        },
        "to": this.receiver
      }
      this.message.sendNotification(notify).subscribe(res => {
      })
    })


  }


  public openModal(customer) {
    let dialogRef = this.dialog.open(CustomerProfileComponent, {
      data: customer,
      panelClass: 'profile-dialog'

    });
  }

  openReviewModal(request) {
    request.status = 'Completed';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      request: request,
      user: false
    };
    this.changeStatus(request, 'Completed');
    let dialogRef = this.dialog.open(ReviewComponent, dialogConfig);
  }
}

