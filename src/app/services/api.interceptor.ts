import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, catchError, switchMap, tap, throwError } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(@Inject('AuthToken') private authKey: string, private apiService: ApiService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    req = this.setHeader(req);
        console.log(req)
    return next.handle(req).pipe(
        catchError(error => {
            if (error instanceof HttpErrorResponse && (error.error.code == '401')) {
              return this.apiService.refreshTokey().pipe(
                switchMap(() => {
                    return next.handle(this.setHeader(req));
                })
              )
            }
            return throwError(() => error);
          })
    );
  }

  private setHeader(req: HttpRequest<any>) {
    if (sessionStorage.getItem(this.authKey)) {
        const token = JSON.parse(sessionStorage.getItem(this.authKey) as string).access_token;
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    return req;
  }
}