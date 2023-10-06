import { Inject, Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../services/api.service';



@Injectable({providedIn: 'root'})
export class AuthGuard {
    constructor(@Inject('AuthToken') private tokenKey: string, private apiService: ApiService) {}
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
        if (state.url.startsWith('/exchange_token')) {
            return true;
        }
        const token = sessionStorage.getItem(this.tokenKey);
        if (!token) {
            this.apiService.navigateToStrava();
            return false;
        }
        return true;
  }
}
