import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../../app.service';
import { AuthService } from '../../../auth.service';
import { User } from '../../../app.models';
import { Router } from '@angular/router';
import { SwitchProfileComponent } from 'src/app/shared/switch-profile/switch-profile.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit {
  public user;
  public currencies = ['USDS', 'EUR'];
  public currency: any;
  public flags = [
    { name: 'English', image: 'assets/images/flags/gb.svg' },
    { name: 'German', image: 'assets/images/flags/de.svg' },
    { name: 'French', image: 'assets/images/flags/fr.svg' },
    { name: 'Russian', image: 'assets/images/flags/ru.svg' },
    { name: 'Turkish', image: 'assets/images/flags/tr.svg' }
  ]
  public flag: any;
  public loggedIn;

  constructor(public appService: AppService, public auth: AuthService, public router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.auth.logInState.subscribe(isLogin => this.loggedIn = isLogin);
    this.auth.newUser.subscribe(user => this.user = user);
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
  }

  public changeCurrency(currency) {
    this.currency = currency;
  }

  public changeLang(flag) {
    this.flag = flag;
  }
  public logOut() {
    window.localStorage.clear();
    this.auth.changeState(false);
    this.router.navigate(['/']);
  }

  public openModal() {
    let dialogRef = this.dialog.open(SwitchProfileComponent, {
      data: this.user,
      panelClass: 'profile-dialog'
    });
  }
}
