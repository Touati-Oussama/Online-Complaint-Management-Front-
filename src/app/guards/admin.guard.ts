import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor (private authService: AuthService,
    private router : Router) {} 
    
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    
      
      if (this.authService.isAdmin())

        return true;
        else
        {
          this.router.navigate(['app-forbidden']);
           return false;
        }
  }
  
}
