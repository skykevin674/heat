import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, mapToCanActivate } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { ColorPickerModule } from 'ngx-color-picker';
import { AuthGuard } from './guards/auth.guard';
import { AuthResolver } from './services/auth.resolver';
import { ApiInterceptor } from './services/api.interceptor';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: mapToCanActivate([AuthGuard]) },
      { path: 'exchange_token', component: HomeComponent, canActivate: mapToCanActivate([AuthGuard]), resolve: {data: AuthResolver} },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
    ]),
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1Ijoic2t5a2V2aW42NzQiLCJhIjoiY2xtYzF1OW5oMTVveTNpbDZkM2xsaGF0ZSJ9.5LZS10SjqEVVyP6-eyA2vA', // Optional, can also be set per map (accessToken input of mgl-map)
    }),
    ColorPickerModule
  ],
  providers: [
    { provide: 'AuthToken', useValue: 'AuthToken' },
    { provide: 'Athlete', useValue: 'Athlete' },
    AuthGuard, AuthResolver,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
