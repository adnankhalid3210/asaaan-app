import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { matchingPasswords } from '../../../theme/utils/app-validators';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  resetForm: FormGroup;
  constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public activeRoute: ActivatedRoute, public auth: AuthService) { }

  id: string;
  ngOnInit() {
    this.activeRoute.paramMap
      .subscribe(params => {
        this.id = params.get('id');
      })
    this.resetForm = this.formBuilder.group({
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      'confirmPassword': ['', Validators.required]

    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }

  onresetFormSubmit(value) {
    // this.auth.updateUser()
  }

}
