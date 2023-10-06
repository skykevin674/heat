import { Inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<any> {
    constructor(private apiService: ApiService, @Inject('Athlete') private athKey: string, @Inject('AuthToken') private tokenKey: string, private router: Router) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const code = route.queryParams['code'];
        return this.apiService.getAccessToken(code).pipe(
            tap((r: any) => {
                const athlete = r.athlete;
                sessionStorage.setItem(this.athKey, JSON.stringify(athlete));
                delete r.athlete;
                sessionStorage.setItem(this.tokenKey, JSON.stringify(r));
                this.router.navigate([''])
            })
        );
    }
}