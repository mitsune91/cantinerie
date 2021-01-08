import { ModalComponent } from './components/modal/modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UserComponent } from './views/user/user.component';
import { CardComponent } from './views/card/card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './views/home/home.component';
import {AppSidebarModule} from './app.sidebar.module';
import { AuthComponent } from './views/auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


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
    NgbModule
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule {}
