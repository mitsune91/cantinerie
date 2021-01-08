import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/User';

export const TOKEN_NAME = 'token_user';
export const ROLE_NAME = 'role_name';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
  ) {
  }

  getRole(): string {
    return localStorage.getItem(ROLE_NAME);
  }

  setRole(role: string): void {
    localStorage.setItem(ROLE_NAME, role);
  }

  /**
   * return the current token
   */
  getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  /**
   * Set the current token
   * @param token
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  /**
   * Log the user
   * @param user
   */
  login(user: User): void {
    if (!!user) {
      const userString = JSON.stringify(user);
      this.setToken(userString);
      this.setRole((user.isLunchLady) ? 'ROLE_CANTEEN' : 'ROLE_USER');
      this.loggedIn.next(true);
      this.router.navigate(['/']);
    }
  }

  /**
   * Logout the user
   */
  logout(): void {
    this.loggedIn.next(false);
    localStorage.removeItem(TOKEN_NAME);
    localStorage.removeItem(ROLE_NAME);
    this.router.navigate(['/login']);
  }
}
