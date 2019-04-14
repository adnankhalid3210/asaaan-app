import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { AuthService } from '../../../../auth.service';

@Component({
  selector: 'app-edit-picture',
  templateUrl: './edit-picture.component.html',
  styleUrls: ['./edit-picture.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditPictureComponent implements OnInit {
  image;
  selectedFile: File = null;
  constructor(public dialogRef: MatDialogRef<EditPictureComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private auth: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log(this.data)
    this.image = this.data.imageUrl;
  }

  public close(): void {
    this.dialogRef.close();
  }
  removePic() {
    this.image = null;
    this.selectedFile = null;
    // console.log('clioc')

  }
  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {

      this.selectedFile = event.target.files[0];

      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.image = reader.result;

      reader.readAsDataURL(file);
    }
  }
  saveImage() {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      this.auth.uploadImage(this.data.id, fd).subscribe(
        (result: any) => {
          this.data.imageUrl = result.url;
          this.auth.updateUserImage(this.data).subscribe(
            result => {
              // this.user = result;
              this.auth.changeUserState(result);
              this.close();
              console.log(this.data)
              this.snackBar.open('Picture updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
            }
          )
        }
      )
    } else if (!this.image) {
      this.data.imageUrl = '';
      this.auth.updateUserImage(this.data).subscribe(
        result => {
          this.auth.changeUserState(result);
          this.close();
          this.snackBar.open('Picture removed successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        }
      )
    }
  }
}
