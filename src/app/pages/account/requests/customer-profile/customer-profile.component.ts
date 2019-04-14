import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from '../../../../auth.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CustomerProfileComponent implements OnInit {

  totalRating = 0;
  reviews;
  showReviews = false;
  constructor(public dialogRef: MatDialogRef<CustomerProfileComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private auth: AuthService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.auth.getReviews(this.data.id).subscribe((res: any) => {
        this.reviews = res.filter(x => {
          return x.reviewType === 'asBuyer'
        })
        console.log(this.reviews)
        for (let i = 0; i < this.reviews.length; i++) {
          this.totalRating += this.reviews[i].rating
        }
        console.log(this.totalRating)
      })
    })
  }

  public close(): void {
    this.dialogRef.close();
  }

  reviewDetails() {
    this.showReviews = !this.showReviews;
  }
}
