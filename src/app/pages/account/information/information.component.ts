import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { emailValidator, matchingPasswords, phoneValidator } from '../../../theme/utils/app-validators';
// import { MapsAPILoader } from '@agm/core';
import { AuthService } from '../../../auth.service';
import { SearchingService } from '../../../searching.service';
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  infoForm: FormGroup;
  passwordForm: FormGroup;
  userForm: FormGroup;

  companies: string[] = ['Electrician', 'Plumber', 'Carpenter', 'Tutor', 'A/C Technician'];
  services;
  @ViewChild('location') public locationRef: ElementRef;
  // @ViewChild('servi') public servRef: ElementRef;

  geocoder;
  lat;
  lng;
  user: any;
  selectedServices: any = [];
  // google;

  constructor(public formBuilder: FormBuilder, public snackBar: MatSnackBar, private ngZone: NgZone, private auth: AuthService,
    public searchService: SearchingService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.searchService.getServices().subscribe((result: any) => {
      this.services = result.map(x => ({ id: x.id, name: x.name }));
    })
    this.infoForm = this.formBuilder.group({
      'name': [this.user.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': [this.user.description ? this.user.description : '', Validators.minLength(20)],
      'category': ['', Validators.required],
      'location': [this.user.address, Validators.required],
      'hourlyRate': [this.user.hourlyRate ? this.user.hourlyRate : 0],
      'coordinates': [this.user.coordinates ? [this.user.coordinates[0], this.user.coordinates[1]] : '']
    });
    if (this.user.category) {
      for (let i = 0; i < this.user.category.length; i++) {
        this.selectedServices.push(this.user.category[i].id)
      }
      this.infoForm.get('category').setValue(this.selectedServices);
      console.log(this.selectedServices)
    }

    this.userForm = this.formBuilder.group({
      'name': [this.user.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      'phone': [this.user.phone]
    });

    this.passwordForm = this.formBuilder.group({
      'currentPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'confirmNewPassword': ['', Validators.required]
    }, { validator: matchingPasswords('newPassword', 'confirmNewPassword') });
    // this.infoForm.controls['services'].setValue(['', '5c7667817299b7900989719e'], { onlySelf: true })
    //Map
    // this.mapApiLoader.load().then(() => {
    //   this.geocoder = new google.maps.Geocoder();
    //   const autocomplete = new google.maps.places.Autocomplete(this.locationRef.nativeElement, {
    //     // types: ['address'],
    //     componentRestrictions: { country: 'pk' }
    //   });

    //   autocomplete.addListener('place_changed', () => {
    //     this.ngZone.run(() => {
    //       // get place result
    //       const place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       // verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
    //       this.lat = place.geometry.location.lat();
    //       this.lng = place.geometry.location.lng();
    //       this.user.coordinates[0] = this.lat;
    //       this.user.coordinates[1] = this.lng;
    //       this.user.address = this.infoForm.get('location').value;
    //     });
    //   });
    // });
  }
  setAddress(addrObj) {
    this.lat = addrObj.lat;
    this.lng = addrObj.lng;
    this.infoForm.get('location').setValue(addrObj.value)
    this.infoForm.get('coordinates').setValue([this.lat, this.lng]);
    // this.infoForm.get('address').setValue(this.locationRef.nativeElement.value)
  }

  public onInfoFormSubmit(values: Object): void {
    console.log(values)
    console.log(this.user)
    if (this.infoForm.valid) {
      let user = {
        id: this.user.id,
        name: this.infoForm.get('name').value,
        category: this.infoForm.get('category').value,
        address: this.infoForm.get('location').value,
        description: this.infoForm.get('description').value,
        hourlyRate: this.infoForm.get('hourlyRate').value,
        coordinates: this.infoForm.get('coordinates').value
      }
      this.auth.updateUser(user).subscribe(
        result => {
          console.log(result)
          this.snackBar.open('Your information updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        }
      )
    }
  }

  public onPasswordFormSubmit(values: Object): void {
    if (this.passwordForm.valid) {
      this.snackBar.open('Your password changed successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
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
    this.user.coordinates[0] = lat;
    this.user.coordinates[1] = lng;
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
        } else {
        }
      } else {
      }
      this.infoForm.get('location').setValue(res);
      this.user.address = res;

    });

  }
  onUserFormSubmit(value) {
    let user = {
      id: this.user.id,
      name: value.name
    }
    this.auth.updateUser(this.user).subscribe(
      result => {
        console.log(result)
        this.snackBar.open('Your information updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      }
    )
  }


}
