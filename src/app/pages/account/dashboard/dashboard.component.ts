import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { EditPictureComponent } from './edit-picture/edit-picture.component';
import { SwitchProfileComponent } from 'src/app/shared/switch-profile/switch-profile.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ratingsCount = 4;
  ratingsValue = 1;
  selectedFile: File = null;
  user: any;

  constructor(private auth: AuthService, public snackBar: MatSnackBar, public dialog: MatDialog) {
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
  }
  ngOnInit() {

  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {

      this.selectedFile = event.target.files[0];

      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.user.imageUrl = reader.result;

      reader.readAsDataURL(file);
    }
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.auth.uploadImage(this.user.id, fd).subscribe(
      (result: any) => {
        this.user.imageUrl = result.url;
        this.auth.updateUser(this.user).subscribe(
          result => {
            // this.user = result;
            // this.auth.changeUserState(result);
            this.snackBar.open('Picture updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
          }
        )
      }
    )
  }
  public editPicture() {
    let dialogRef = this.dialog.open(EditPictureComponent, {
      data: this.user,
      panelClass: 'profile-dialog'
    });
  }
  // updateImage() {
  //   const fd = new FormData();
  //  fd.append('image', this.selectedFile, this.selectedFile.name);
  //  this.auth.uploadImage(this.user.id,fd).subscribe(
  //    (result:any) => {
  //      this.user.imageUrl = result.url;
  //    }
  //  )

  // }
  public openModal(customer) {
    let dialogRef = this.dialog.open(SwitchProfileComponent, {
      data: this.user,
      panelClass: 'profile-dialog'
    });
  }
}
