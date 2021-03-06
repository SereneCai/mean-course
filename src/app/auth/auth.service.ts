import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

import {environment} from "../../environments/environment";

const BACKEND_URL= environment.apiUrl + '/users/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  //to be able to let component interested to know about the status of the user
  //boolean as we only want to know login or not
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) { }

  getToken(){
      return this.token;
  }

  getIsAuthenticated(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable(); //to be able to listen from other componenets as it is private
  }

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    return this.http.post(BACKEND_URL + "/signup", authData)
      .subscribe(()=>{
        this.router.navigate(["/"]);
      }, error => {
        this.authStatusListener.next(false);
      })
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + "/login", authData)
      .subscribe(response=>{
        const token = response.token; //send as json from backend from user routes
        this.token = token;
        if(token){ //checking validity of token
          const expiresSession = response.expiresIn;
          this.setAuthTimer(expiresSession);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true); //to pass info that the user is authenticated
          const now = new Date();
          const expiration = new Date(now.getTime() + expiresSession *1000);
          this.saveAuth(token, expiration, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
      this.authStatusListener.next(false);
    })
  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expiration.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer((expiresIn / 1000));
      this.authStatusListener.next(true);
    }

  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer); //will clear timer one logout, either manually or automatically
    this.clearAuth();
    this.userId = null; // to reset user when they logout **important!
    this.router.navigate(['/']);
  }

  //function for token timer expiration
  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() =>{this.logout();}, duration * 1000)
  }

  //save all at login
  private saveAuth(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  //clear everything at logout
  private clearAuth(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  //for determination of whether the user's session is still valid at autoAuth function by checking the local storage
  private getAuthData(){
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expiration){

    }
    return {
      token: token,
      expiration: new Date(expiration),
      userId: userId
    }
  }
}
