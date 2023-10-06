import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor() {}

  ngOnInit(): void {
    
    // if (!location.search) {
    //   location.href = `http://www.strava.com/oauth/authorize?client_id=113309&response_type=code&redirect_uri=http://localhost:44428/exchange_token&approval_prompt=force&scope=read`
    // } else {
    //   const params = new URLSearchParams(location.search);
    //   const code = params.get('code');
    //   this.http.post('https://www.strava.com/oauth/token', {
    //     client_id: '113309',
    //     client_secret: '70fc9f1c3726731ed5efbd26c814c51fdbb96079',
    //     code,
    //     grant_type: 'authorization_code'
    //   }).subscribe(r => console.log(r))
    //   console.log(code)
    // }
    
  }
}
