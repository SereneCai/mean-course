import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

@Injectable()

export class ErrorInterceptor implements HttpInterceptor{

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        alert(error.error.error.message); //due to mongoose adding 1 more error within
        return throwError(error);
      })
    );
  }
}

//2 arguments
// HttpRequest<any> --> static, middleware for outgoing req
//now all outgoing http req will be watched by this interceptor
