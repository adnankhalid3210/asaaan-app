import { Component, OnInit, ViewChild, ElementRef, NgZone  } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
//import { } from 'googlemaps';
// import { MapsAPILoader } from '@agm/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Router } from '@angular/router';
import { SearchingService } from '../../searching.service';
import { MatSnackBar } from '@angular/material';
//import { } from '@types/googlemaps';
 //import { google } from '@agm/core/services/google-maps-types';
//import {} from '@types/googlemaps';

export interface Search {
  id: string;
  name: string;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})



export class SearchBarComponent implements OnInit {
  // @ViewChild('location') public locationRef: ElementRef;
  geocoder;
  searchForms: FormGroup;
  lat;
  lng;
  service;
  // reference google="@types/googlemaps"
  constructor(private ngZone: NgZone, private router: Router, private searchService: SearchingService, public snackBar: MatSnackBar) { 
    this.searchForms = new FormGroup({
      location: new FormControl(''),
      service: new FormControl(''),
    });
  }
  options: Search[];
  filteredOptions: Observable<Search[]>;

  private _filter(value: string): Search[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.searchService.getServices().subscribe((results:any) => {
      console.log(results)
      this.options  = results.map(x=> ({ id: x.id, name: x.name }));
      this.filteredOptions = this.searchForms.get('service').valueChanges
      .pipe(
        startWith<string | Search>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
    })
    
//     this.mapApiLoader.load().then(() => {
//     this.geocoder = new google.maps.Geocoder();
//       const autocomplete = new google.maps.places.Autocomplete(this.locationRef.nativeElement, {
//         // types: ['address'],
//         componentRestrictions: {country: 'pk'}
//       });

//       autocomplete.addListener('place_changed', () => {
//         this.ngZone.run(() => {
//           // get place result
//           const place: google.maps.places.PlaceResult = autocomplete.getPlace();
//           // verify result
//           if (place.geometry === undefined || place.geometry === null) {
//             return;
//           }
// this.lat = place.geometry.location.lat();
// this.lng = place.geometry.location.lng();
//         });
//       });
//     });
  }
  setAddress(addrObj) {
    this.lat = addrObj.lat;
    this.lng = addrObj.lng;
  }

  displayFn(option?: Search ) {
    return option ? option.name : undefined;
  }
  
  getLocation() {
   
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      this.lng = position.coords.longitude;
      this.lat = position.coords.latitude;
      this.latlng(this.lat,this.lng);
    });
  }
  }
  
 latlng(lat,lng) {
    let latlng = new google.maps.LatLng(lat,lng);
    let res;
    this.geocoder.geocode({'latLng': latlng}, (results, status)=> {
    
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
         //formatted address
         res = results[0].formatted_address; 
        //  alert(results[0].formatted_address)
        //find country name
             for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {

            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    //this is the object you are looking for
                   var city= results[0].address_components[i];
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
      this.searchForms.get('location').setValue(res);

    });

  }
  search() {
    this.lat? this.router.navigate(['/providers/', this.lat ,this.lng,this.searchForms.get('service').value.id, 5000]) : this.snackBar.open('Please select location from dropdown!', '×', { panelClass: 'red-snackbar', verticalPosition: 'top', duration: 3000 });
    // this.router.navigate(['/products/', this.lat ,this.lng,this.searchForms.get('service').value.id, 5000]);
  }
}
