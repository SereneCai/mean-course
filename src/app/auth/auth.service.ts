import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

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

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/users/signup", authData)
      .subscribe(response=>{
        console.log(response);
      });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/users/login", authData)
      .subscribe(response=>{
        const token = response.token; //send as json from backend from user routes
        this.token = token;
        if(token){ //checking validity of token
          const expiresSession = response.expiresIn;
          this.setAuthTimer(expiresSession);
          this.isAuthenticated = true;
          this.authStatusListener.next(true); //to pass info that the user is authenticated
          const now = new Date();
          const expiration = new Date(now.getTime() + expiresSession *1000);
          this.saveAuth(token, expiration);
          console.log(token, expiration);
          this.router.navigate(['/']);
        }
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
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){
    console.log(duration);
    this.tokenTimer = setTimeout(() =>{this.logout();}, duration * 1000)
  }

  private saveAuth(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuth(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("expiration");
    if(!token || !expiration){

    }
    return {
      token: token,
      expiration: new Date(expiration)
    }

  }
}
