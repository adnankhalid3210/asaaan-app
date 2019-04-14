import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../auth.service';
import { IReview } from '../../app.models';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  public reviewForm: FormGroup;
  review: IReview;
  rating: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ReviewComponent>, private auth: AuthService, public formBuilder: FormBuilder,
    public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.reviewForm = this.formBuilder.group({
      'comments': [null, Validators.required]
    })
  }

  public close(): void {
    this.dialogRef.close();
  }
  rate(value) {
    this.rating = value;
  }
  submitReview(data) {
    if (this.reviewForm.valid) {
      if (this.data.user) {
        let userId = this.data.request.serviceProvider.id;
        this.data.request.serviceProvider.id = this.data.request.user.id;
        this.data.request.user.id = userId;
      }
      this.review = {
        order: this.data.request.id,
        givenBy: this.data.request.serviceProvider.id,
        givenTo: this.data.request.user.id,
        rating: this.rating,
        comments: this.reviewForm.get('comments').value,
        reviewType: this.data.user ? 'asSeller' : 'asBuyer'
      }
      this.auth.review(this.review).subscribe(res => {
        this.snackBar.open('Thanks for your review!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

      })
      this.close();
    }
  }
}
