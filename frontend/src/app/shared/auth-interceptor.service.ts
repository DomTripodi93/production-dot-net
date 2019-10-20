import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private auth: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        if (req.url != this.auth.authApiUrl +"auth/register/" && req.url != this.auth.authApiUrl +"auth/login/"){
            const authenticatedRequest = req.clone({
                headers: req.headers.append("Authorization", 'Bearer ' + this.auth.token)
            })
            return next.handle(authenticatedRequest);
        } else {
            return next.handle(req)
        }
        //Checks outgoing HTTP requests, and appends Authorization headers if they are not registration or login
        // requests 
    }
}
