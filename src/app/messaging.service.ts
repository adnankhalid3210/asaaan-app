import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  url = 'http://109.203.126.97:1339/api/v1';
  constructor(
    private http: HttpClient,
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token
        this.angularFireDB.object('fcmTokens/').update(data)
      })
  }
  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        this.currentMessage.next(payload);
      })
  }
  data = {
    "lat": 24.910688,
    "lng": 67.03109730000006,
    "service": 'Software Engineer'
  }
  getPersons() {
    return this.http.post('https://asaan.herokuapp.com/api/services/', this.data)
  }
  sendNotification(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization' : 'key=AAAAFKO473s:APA91bG8eZFP3NBSLunhkv7eNxgAMqEL7F-MAk9PAVckuTOzSaaOgFvAOg5GRPFlo1thcPY7d0bq6b1Q47lKXgAzgmrMwxY_HcXorDldNyRRrraNxLsNZlZLiCMC5uX-C6nXyf30iCvH'
    });
    let options = { headers: headers };
    return this.http.post('https://fcm.googleapis.com/fcm/send', data, options)
  }
  getToken(phone) {
    return this.angularFireDB.object('fcmTokens/' + phone).valueChanges()
  }

  notificationsInit(num) {
    this.requestPermission(num);
    this.receiveMessage();
  }
}
