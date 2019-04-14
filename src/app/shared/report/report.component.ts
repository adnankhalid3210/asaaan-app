import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportReason: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ReportComponent>,
    public snackBar: MatSnackBar, private auth: AuthService) {
  }
  ngOnInit() {
  }
  public close(): void {
    this.dialogRef.close();
  }
  reportSubmit() {
    if (this.reportReason) {
      let user = JSON.parse(localStorage.getItem('user'))
      let report = {
        user: this.data.id,
        reportedBy: user.id,
        reportReason: this.reportReason
      }
      this.auth.reportUser(report).subscribe(
        res => {
          this.snackBar.open('Your report has been submitted!', '×', { panelClass: 'danger', verticalPosition: 'top', duration: 3000 });
        }
      )
      this.close()
    }
  }
}
