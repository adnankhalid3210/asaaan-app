import { Injectable, EventEmitter } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { BadRequest } from '../../shared/common/bad-request';
import { AppError } from '../../shared/common/app-error';
import { NotFound } from '../../shared/common/not-found';
//import { Observable } from "rxjs";
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) { }

  // intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  //     this.spinner.show();

  //     return next.handle(req).do((event: HttpEvent<any>) => {
  //       if (event instanceof HttpResponse) {        
  //          this.spinner.hide();
  //          console.log('response')
  //       }
  //     }, (err: any) => {
  //       this.spinner.hide();
  //       if (err instanceof HttpErrorResponse) {
  //           if(err.status === 400){
  //             console.log('Bad request interceptor' + err.status);
  //           return throwError(new BadRequest());

  //         } else if (err.status === 404) {
  //           console.log('Not found interceptor' + err.status);
  //           return throwError(new NotFound());	 

  //         }
  //         else {
  //           console.log('Apperror interceptor' + err.status);        
  //           return throwError( new AppError());

  //         }
  //         const started = Date.now();            
  //         const elapsed = Date.now() - started;
  //         console.log(`Request for ${req.urlWithParams} failed after ${elapsed} ms.`);
  //        // debugger;
  //       }
  //     })
  // }  

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // ...
    this.spinner.show();

    return next
      .handle(request)
      .pipe(
        tap((ev: HttpEvent<any>) => {
          if (ev instanceof HttpResponse) {
            this.spinner.hide();
            console.log('response')
          }
        }),
        catchError(response => {
          this.spinner.hide();
          if (response instanceof HttpErrorResponse) {
            console.log('Processing http error', response);
            if (response.status === 404) {
              console.log('Error agaya 404');

              return throwError(new NotFound(response));
            } else if (response.status === 400) {
              console.log('Error agaya 400');
              return throwError(new BadRequest(response));
            }
            else {
              return throwError(new AppError(response));
            }

          }

          return throwError(response);
        })
      )
  }
}

