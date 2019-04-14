import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { phoneValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { VerificationComponent } from './verification/verification.component';
import { SearchingService } from '../../searching.service';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-become-seller',
  templateUrl: './become-seller.component.html',
  styleUrls: ['./become-seller.component.scss']
})
export class BecomeSellerComponent implements OnInit {
  registerForm: FormGroup;
  company;
  @ViewChild('location') public locationRef: ElementRef;
  geocoder;
  lat;
  lng;

  constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, private ngZone: NgZone, private auth: AuthService,
    public dialog: MatDialog, public searchService: SearchingService) {
      this.auth.logInState.pipe(take(1)).subscribe(isLogin => {
        if (isLogin) {
          this.router.navigate(['/account'])
        }
      })
    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'phone': ['', Validators.compose([Validators.required, phoneValidator])],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required],
      'address': ['', Validators.required],
      'category': ['', Validators.required],
      'coordinates': [''],
    }, { validator: matchingPasswords('password', 'confirmPassword') });

  }

  ngOnInit() {
    

    this.searchService.getServices().subscribe((result: any) => {
      this.company = result.map(x => ({ id: x.id, name: x.name }));
    })
    // this.mapApiLoader.load().then(() => {
    //   this.geocoder = new google.maps.Geocoder();
    //   const autocomplete = new google.maps.places.Autocomplete(this.locationRef.nativeElement, {
    //     componentRestrictions: { country: 'pk' }
    //   });

    //   autocomplete.addListener('place_changed', () => {
    //     this.ngZone.run(() => {
    //       const place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
    //       this.lat = place.geometry.location.lat();
    //       this.lng = place.geometry.location.lng();
    //       this.registerForm.get('coordinates').setValue([this.lat,this.lng]);

    //     });
    //   });
    // });
  }
  setAddress(addrObj) {
    this.lat = addrObj.lat;
    this.lng = addrObj.lng;
    this.registerForm.get('address').setValue(addrObj.value)
    this.registerForm.get('coordinates').setValue([this.lat, this.lng]);
  }

  public onRegisterFormSubmit(values: any): void {
    if (!this.lat) {
      this.registerForm.get('address').setErrors({ notValid: true })
    }

    if (this.registerForm.valid) {
      // Check uniquness
      this.auth.isUnique(values.phone).subscribe((result: any) => {
        if (result.message === "User not found.") {
          this.openModal();
        } else {
          this.registerForm.get('phone').setErrors({ notUnique: true })
        }
      })
      // this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

  getLocation() {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lng = position.coords.longitude;
        this.lat = position.coords.latitude;
        this.latlng(this.lat, this.lng);
      });
    }
  }

  latlng(lat, lng) {
    this.registerForm.get('coordinates').setValue([lat, lng]);
    // let latlng = new google.maps.LatLng(24.9107,67.0311);
    let latlng = new google.maps.LatLng(lat, lng);
    let res;
    this.geocoder.geocode({ 'latLng': latlng }, (results, status) => {

      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          //formatted address
          res = results[0].formatted_address;
          //  alert(results[0].formatted_address)
          //find country name
          for (var i = 0; i < results[0].address_components.length; i++) {
            for (var b = 0; b < results[0].address_components[i].types.length; b++) {

              //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                //this is the object you are looking for
                var city = results[0].address_components[i];
                break;
              }
            }
          }
          //city data

          // alert(city.short_name + " Hey " + city.long_name)


        } else {
          // alert("No results found");
        }
      } else {
        // alert("Geocoder failed due to: " + status);
      }
      this.registerForm.get('address').setValue(res);

    });
  }
  search() {
  }

  dialogRef;
  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Verify your phone number',
      user: this.registerForm.value
    };
    this.dialogRef = this.dialog.open(VerificationComponent, dialogConfig);
  }
  closeModal() {
    this.dialogRef.close();
  }


}
