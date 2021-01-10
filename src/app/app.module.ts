import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalComponent } from './components/modal/modal.component';
import { UserComponent } from './views/user/user.component';
import { CardComponent } from './views/card/card.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './views/home/home.component';
import { AppSidebarModule } from './app.sidebar.module';
import { AuthComponent } from './views/auth/auth.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { ModalsModule } from './components/modal/modals.module';
import { HttpInterceptors } from './interceptors/http.interceptors';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    UserComponent,
    CardComponent,
    AuthComponent,
    ResetPasswordComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppSidebarModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ModalsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptors, multi: true}
  ],
  exports: [],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule {
}
