import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../app.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../auth.service';
import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  counter$: Observable<number>;
  count = 60;
  btnDisable: boolean = true;
  order;
  sp;
  constructor(public appService: AppService, public snackBar: MatSnackBar, public auth: AuthService) { }

  ngOnInit() {
    this.count = 60;
    this.counter$ = timer(0, 1000).pipe(
      take(this.count),
      map(() => --this.count)
    );
    setTimeout(() => this.btnDisable = !this.btnDisable, 600000)
    this.sp = JSON.parse(localStorage.getItem('sp'))
    this.order = this.auth.order;
    setTimeout(() => {
      this.snackBar.open('You request sent successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }, 800)

  }
}
