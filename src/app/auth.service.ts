import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './app.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  logInState = this.loggedIn.asObservable();

  user: User;
  private myUser = new BehaviorSubject<User>(this.user);
  newUser = this.myUser.asObservable();
  order;
  url = 'http://109.203.126.97:1339/api/v1';
  constructor(private http: HttpClient) {
    let token = window.localStorage.getItem('token');
    (token) ? this.loggedIn.next(true) : this.loggedIn.next(false);
    this.user = JSON.parse(localStorage.getItem('user'));
    (this.user) ? this.myUser.next(this.user) : this.myUser.next(null);
  }

  login(data) {
    return this.http.post(this.url + '/user/login', data)
  }
  windowRef() {
    return window
  }

  isUnique(number) {
    return this.http.get(this.url + '/user/checkExistance/' + number)
  }

  resgister(data) {
    return this.http.post(this.url + '/user/register', data)
  }

  changeUserState(user) {
    this.myUser.next(user);
    window.localStorage.setItem('user', JSON.stringify(user));
  }

  saveUser(user, token) {
    this.myUser.next(user);
    this.user = user;
    localStorage.setItem('token', JSON.stringify(token));
    window.localStorage.setItem('user', JSON.stringify(user));
  }
  changeState(value: boolean) {
    this.loggedIn.next(value);
  }
  
  uploadImage(id, fd) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    return this.http.post(this.url + '/user/uploadImage', fd);
  }
  updateUserImage(user: any) {
    return this.http.patch(this.url + '/user/' + user.id, user = {
      imageUrl: user.imageUrl
    })
  }
  updateUser(user: any) {
    return this.http.patch(this.url + '/user/' + user.id, user)
  }
  makeOrder(data) {
    return this.http.post(this.url + '/orders', data)
  }
  getOrders() {
    return this.http.get(this.url + '/orders/user/' + this.user.id);
  }
  getServiceProvider(id) {
    return this.http.get(this.url + '/user/' + id);
  }
  getHiringRequests() {
    return this.http.get(this.url + '/orders/serviceProvider/' + this.user.id)
  }
  updateOrder(order) {
    return this.http.patch(this.url + '/orders/' + order.id, order)
  }
  review(data) {
    return this.http.post(this.url + '/reviews/', data);
  }
  getReviews(id) {
    return this.http.get(this.url + '/reviews/user/' + id);
  }
  reportUser(data) {
    return this.http.post(this.url + '/user/report/', data);
  }

}
