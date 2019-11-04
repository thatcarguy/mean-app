import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './model/auth-data.model';

@Injectable()
export class AuthService {
  private token: string;
  url = 'http://localhost:3000/api/user';
  constructor(private http: HttpClient) {}

  getToken(){
    return this.token;
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
    });
  }
}
