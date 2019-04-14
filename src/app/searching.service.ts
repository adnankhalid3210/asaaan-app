import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchingService {

  url = 'http://109.203.126.97:1339/api/v1';

  constructor(private http: HttpClient) { }

  getServices() {
    return this.http.get(this.url + '/categories')
  }

  search(data) {
    return this.http.post(this.url + '/user/search', data)
  }
}
