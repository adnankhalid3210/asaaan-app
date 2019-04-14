import { Component, OnInit, ViewChild, HostListener, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ProductDialogComponent } from '../../shared/products-carousel/product-dialog/product-dialog.component';
import { AppService } from '../../app.service';
import { Product, Category, ISearch } from "../../app.models";
import { SearchingService } from '../../searching.service';
import { AppError } from '../../shared/common/app-error';
import { NotFound } from '../../shared/common/not-found';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen: boolean = true;
  private sub: any;
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [12, 24, 36];
  public count: any;
  public sortings = ['Sort by Nearest', 'Sort By Top Rated', 'Sort By New Providers'];
  public sort: any;
  public products: Array<Product> = [];
  public categories: Category[];
  public brands = [];
  public priceFrom: number = 5;
  public priceTo: number = 1599;
  public colors = ["#5C6BC0", "#66BB6A", "#EF5350", "#BA68C8", "#FF4081", "#9575CD", "#90CAF9", "#B2DFDB", "#DCE775", "#FFD740", "#00E676", "#FBC02D", "#FF7043", "#F5F5F5", "#000000"];
  public sizes = ["S", "M", "L", "XL", "2XL", "32", "36", "38", "46", "52", "13.3\"", "15.4\"", "17\"", "21\"", "23.4\""];
  public page: any;
  public searchParams: any;
  public serviceProviders: any;
  public nearests: any;
  public search: ISearch;
  data;
  spExists: boolean = false;

  @ViewChild('location') public locationRef: ElementRef;
  geocoder;
  lat;
  lng;
  constructor(private activatedRoute: ActivatedRoute, public appService: AppService, public dialog: MatDialog, private router: Router, public searchService: SearchingService, private ngZone: NgZone) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: ISearch) => {
      this.data = {
        lat: +params.lat,
        lng: +params.lng,
        category: params.category,
        distance: +params.distance
      };
      this.getServiceProviders(this.data);
      this.searchParams = params;
      this.priceFrom = (params.distance / 1000);
    })
    this.count = this.counts[0];
    this.sort = this.sortings[0];
    this.sub = this.activatedRoute.params.subscribe(params => {
    });
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    };
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    };

    this.getCategories();
    this.getBrands();
    this.getAllProducts();
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
    //     });
    //   });
    // });
  }
  setAddress(addrObj) {
    this.data.lat = addrObj.lat;
    this.data.lng = addrObj.lng;
    this.ngZone.run(() => {
      this.distanceChange();

    });
    // this.registerForm.get('coordinates').setValue([this.lat, this.lng]);
  }

  public getAllProducts() {
    this.appService.getProducts("featured").subscribe(data => {
      this.products = data;
      //for show more product  
      for (var index = 0; index < 3; index++) {
        this.products = this.products.concat(this.products);
      }
    });
  }

  public getCategories() {
    if (this.appService.Data.categories.length == 0) {
      this.appService.getCategories().subscribe(data => {
        this.categories = data;
        this.appService.Data.categories = data;
      });
    }
    else {
      this.categories = this.appService.Data.categories;
    }
  }

  public getBrands() {
    this.brands = this.appService.getBrands();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }

  public changeCount(count) {
    this.count = count;
  }

  public changeSorting(sort) {
    this.sort = sort;
    if (sort === 'Sort By Top Rated') {
      this.serviceProviders = [...this.serviceProviders].sort((a, b) => (a.user.rating > b.user.rating) ? -1 : ((b.user.rating > a.user.rating) ? 1 : 0));
    }
    if(sort === 'Sort By New Providers') {
      this.serviceProviders = [...this.serviceProviders].sort((a,b) => (a.user.createdAt > b.user.createdAt) ? -1 : ((b.user.createdAt > a.user.createdAt) ? 1 : 0)); 
    }
    if(sort === 'Sort by Nearest') {
      this.serviceProviders = this.nearests;
    }
  }

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product) {
    let dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: 'product-dialog'
    });
    // Here we sending to public profile
    dialogRef.afterClosed().subscribe(product => {
      if (product) {
        // this.router.navigate(['/products', product.id, product.name]); 
        this.router.navigate(['/providers', product.user.id]);
      }
    });
  }

  public onPageChanged(event) {
    this.page = event;
    this.getAllProducts();
    window.scrollTo(0, 0);
  }

  // Asaan
  public onChangeCategory(event) { // Method needs to be change
    if (event.target) {
      this.router.navigate(['/providers', this.data.lat, this.data.lng, event.target.textContent]);
    }
  }

  public getServiceProviders(data) {
    this.searchService.search(data).subscribe((result: any) => {
      if (result.length > 0) {
        // result.splice(1, 0, "");
        this.spExists = false;
        this.serviceProviders = this.nearests = result;
        console.log(this.serviceProviders)
      } else {
        this.spExists = true;
        this.serviceProviders = this.nearests = null;
      }
    },
      (error: AppError) => {
        if (error instanceof NotFound) {
        } else {
          throw error;
        }
      })
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.data.lng = position.coords.longitude;
        this.data.lat = position.coords.latitude;
        this.latlng(this.data.lat, this.data.lng);
      });
    }
  }

  latlng(lat, lng) {
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
      this.locationRef.nativeElement.value = res;

    });

  }
  distanceChange() {
    this.router.navigate(['/providers', this.data.lat, this.data.lng, this.searchParams.category, this.priceFrom * 1000]);
  }
}