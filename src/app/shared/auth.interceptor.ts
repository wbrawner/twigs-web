import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private cookieService: CookieService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.cookieService.check('Authorization')) {
            return next.handle(req);
        }
        let headers = req.headers;
        headers = headers.append('Authorization', `Basic ${this.cookieService.get('Authorization')}`);
        this.cookieService.set('Authorization', this.cookieService.get('Authorization'), 14, null, null, true);
        return next.handle(req.clone({headers: headers}));
    }
}