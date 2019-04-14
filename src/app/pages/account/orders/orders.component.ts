import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ReviewComponent } from '../../../shared/review/review.component';
import { MessagingService } from '../../../messaging.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders;
  dialogRef;
  receiver;

  constructor(public auth: AuthService, public dialog: MatDialog, public message: MessagingService) { }

  ngOnInit() {
    this.auth.getOrders().subscribe((result: any) => {
      this.orders = result.reverse();
    })
  }

  changeStatus(order, status) {
    order.status = status
    let newOrder = {
      id: order.id,
      status: status
    }
    this.auth.updateOrder(newOrder).subscribe(res => {
    })

    this.message.getToken(order.serviceProvider.phone).subscribe(res => {
      this.receiver = res;
      let notify = {
        "notification": {
          "title": "Hello" + ' ' + order.serviceProvider.name,
          "body": "Request has been" + status + ".",
          "icon": "https://res.cloudinary.com/dz8zgvu8s/image/upload/v1553258338/logo3.png"
        },
        "to": this.receiver
      }
      this.message.sendNotification(notify).subscribe(res => {
      })
    })
  }

  openReviewModal(order) {
    order.status = 'Closed';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      request: order,
      user: true
    };
    this.changeStatus(order, 'Closed')
    this.dialogRef = this.dialog.open(ReviewComponent, dialogConfig);
  }
}
