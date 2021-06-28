import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  //to be able to let component interested to know about the status of the user
  //boolean as we only want to know login or not
  private isAuthenticated = false;

  constructor(private http: HttpClient) { }

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
    this.http.post<{token: string}>("http://localhost:3000/api/users/login", authData)
      .subscribe(response=>{
        const token = response.token; //send as json from backend from user routes
        this.token = token;
        if(token){ //checking validity of token
          this.isAuthenticated = true;
          this.authStatusListener.next(true); //to pass info that the user is authenticated
        }
      })
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}
