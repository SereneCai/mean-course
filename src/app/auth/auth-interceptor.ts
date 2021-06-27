import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor{

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer" + authToken) //adds a new header to the header
    });
    return next.handle(authRequest);
  }
}

//2 arguments
// HttpRequest<any> --> static, middleware for outgoing req
