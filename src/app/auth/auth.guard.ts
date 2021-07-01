//auth guard is an angular service

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()

export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuthenticated();
    if(!isAuth){
      this.router.navigate(['/auth/login'])
    }
    return isAuth;
  }

  //return true means the user can go there

}
