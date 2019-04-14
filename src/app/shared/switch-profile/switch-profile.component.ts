import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { SearchingService } from 'src/app/searching.service';
import { AuthService } from 'src/app/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-switch-profile',
  templateUrl: './switch-profile.component.html',
  styleUrls: ['./switch-profile.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class SwitchProfileComponent implements OnInit {
  switchProfile: FormGroup;
  company;
  lat;
  lng;
  constructor(public formBuilder: FormBuilder, public searchService: SearchingService, public auth: AuthService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SwitchProfileComponent>) { 
    console.log(this.data)
    this.switchProfile = this.formBuilder.group({
      'name': [this.data.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      'phone': [this.data.phone],
      'address': ['', Validators.required],
      'category': ['', Validators.required],
      'coordinates': [''],
    });
    this.searchService.getServices().subscribe((result: any) => {
      this.company = result.map(x => ({ id: x.id, name: x.name }));
    })
  }

  ngOnInit() {

  }

  setAddress(addrObj) {
    this.lat = addrObj.lat;
    this.lng = addrObj.lng;
    this.switchProfile.get('address').setValue(addrObj.value)
    this.switchProfile.get('coordinates').setValue([this.lat, this.lng]);
  }

  public onswitchProfileSubmit(values: any): void {
    if (!this.lat) {
      this.switchProfile.get('address').setErrors({ notValid: true })
    }
    if (this.switchProfile.valid) {
      let user = {
        id: this.data.id,
        address: values.address,
        coordinates: values.coordinates,
        category: values.category
      }
      this.auth.updateUser(user).subscribe(res=> {
        console.log(res);
        this.auth.changeUserState(res);
        this.close()
      })
      // this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

  close() {
    this.dialogRef.close();
  }

}
