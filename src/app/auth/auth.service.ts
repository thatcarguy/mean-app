import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './model/auth-data.model';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  url = 'http://localhost:3000/api/user';
  constructor(private http: HttpClient) {}

  getToken(){
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    console.log('hello');
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post(this.url + '/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{token: string}>(this.url + '/login', authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
      }

    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}
