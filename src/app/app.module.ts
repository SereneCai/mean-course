import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { BrowserModule } from '@angular/platform-browser';
import {ReactiveFormsModule} from "@angular/forms";

import {AngularMaterialModule} from "./angular-material.module";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import {AuthInterceptor} from "./auth/auth-interceptor";
import {ErrorInterceptor} from "./error-interceptor";
import {ErrorComponent } from './error/error.component';
import {PostsModule} from "./post/posts.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, //unlocks the reactive driven form approach
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
