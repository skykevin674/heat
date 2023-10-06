import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import * as polyline from '@mapbox/polyline';

@Injectable({providedIn: 'root'})
export class ApiService {
    clientId = '113309';
    clientSecret = '70fc9f1c3726731ed5efbd26c814c51fdbb96079';

    constructor(private http: HttpClient, @Inject('AuthToken') private authToken: string, @Inject('BASE_URL') private baseUrl: string, @Inject('Athlete') private athKey: string) { }
    
    navigateToStrava() {
        location.href = `http://www.strava.com/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${location.protocol}//${location.host}/exchange_token&approval_prompt=force&scope=read,activity:read`
    }

    getAccessToken(code: string) {
        return this.http.post('https://www.strava.com/oauth/token', {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
            grant_type: 'authorization_code'
        })
    }
    
    refreshTokey() {
        const token = JSON.parse(sessionStorage.getItem(this.authToken) as string);

        return this.http.post('https://www.strava.com/oauth/token', {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: token.refresh_token,
            grant_type: 'authorization_code'
        }).pipe(
            tap(r => {
                sessionStorage.setItem(this.authToken, JSON.stringify(r));
            })
        )
    }

    loadTracks(payload: any) {
        // const athlete = JSON.parse(sessionStorage.getItem(this.athKey) as string);
        // return this.http.get(`${this.baseUrl}api/gpx/track/${athlete.id}`)
        return this.http.get(`https://www.strava.com/api/v3/athlete/activities?after=${payload.start}&before=${payload.end}&page=1&per_page=${payload.count}`)
    }

    test() {
        return this.http.get('https://www.strava.com/api/v3/athlete/activities?page=1&per_page=5').subscribe((r: any) => {
            r.forEach((e: any) => {
                console.log(polyline.decode(e.map.summary_polyline))
            });
        })
    }
}