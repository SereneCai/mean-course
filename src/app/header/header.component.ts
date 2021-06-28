import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userAuthenticated = false;

  constructor(private authService: AuthService) { }

  onLogout(){
    this.authService.logout();
  }

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated =>{
        this.userAuthenticated = isAuthenticated; //get the result from auth.service and set to true if received
      });
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }


}
