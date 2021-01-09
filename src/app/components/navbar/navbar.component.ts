import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthService, ROLE_NAME, TOKEN_NAME} from 'src/app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  role: string;
  wallet: number;
  connectedUserId: number;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    // setTimeout
    this.isLoggedIn$ = this.authService.loggedIn;
    if (this.isLoggedIn()) {
      this.wallet = this.getUserWallet();
      this.role = localStorage.getItem(ROLE_NAME);
    }

    this.connectedUserId = this.getUserId();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  onBasket(): void {
    this.router.navigate(['profile/:id']);
  }

  isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  isUser(): boolean {
    return (localStorage.getItem(ROLE_NAME) === 'ROLE_USER') ? true : false;
  }

  onNavigateHome(): string {
    return (localStorage.getItem(ROLE_NAME) === 'ROLE_CANTEEN') ? '/canteen' : '/';
  }

  getUserWallet(): number {
    const token = JSON.parse(localStorage.getItem(TOKEN_NAME));
    return token.wallet;
  }

  getUserId(): number {
    const token = JSON.parse(localStorage.getItem(TOKEN_NAME));
    return token.id;
  }
}
