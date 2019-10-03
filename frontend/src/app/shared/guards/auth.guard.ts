import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ){}
  canActivate(): boolean {
    if (this.auth.isAuthenticated){
      return true;
    }
    window.alert("You must be logged in to access this route!");
    this.router.navigate(["/"]);
    return false;
  }
  
}
