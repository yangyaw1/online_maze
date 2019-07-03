import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Message } from '../models/message.model';
import * as moment from "moment";
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  constructor(private httpClient: HttpClient) { }
  
  login(uname: string, password: string): Promise<Message>{
    this.user = {
      uname: uname,
      password: password,
      uid: 0
    }
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.httpClient.post(`api/v1/login`, this.user, options)
               .toPromise()
               .then((res: any) => {
                 console.log('do!')
                 this.setSession(res)})
               .catch(this.handleError);
  }
  
  signup(uname: string, password: string): Promise<Message>{
    this.user = {
      uname: uname,
      password: password,
      uid: 0
    }
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.httpClient.post(`api/v1/signup`, this.user, options)
               .toPromise()
               .then((res: any) => {
                 console.log('do!')
                 this.setSession(res)})
               .catch(this.handleError);
  }
  
  homecheck(): Promise<string>{
    const idToken = localStorage.getItem("id_token");
    const uname = localStorage.getItem("uname");
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.httpClient.post(`api/v1/auth/${uname}`, {message: idToken}, options)
             .toPromise()
             .then((res: any) => uname)
             .catch(this.handleError);
  }
  
  checktoken(uname: string): Promise<Message>{
    const idToken = localStorage.getItem("id_token");
    console.log(idToken);
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.httpClient.post(`api/v1/auth/${uname}`, {message: idToken}, options)
             .toPromise()
             .then((res: any) => res)
             .catch(this.handleError);
  }
  
  private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn,'second');
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('uname', authResult.uname);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }          

  logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("uname");
        localStorage.removeItem("expires_at");
  }

  isLoggedIn() {
        return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
        return !this.isLoggedIn();
  }

  getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
  }    
  
  
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}
