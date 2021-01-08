import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/User';

export const TOKEN_NAME = 'token_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn(): Observable<any> {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
  ) {
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
  login(user: User[]): void {
    if (!!user) {
      const userString = JSON.stringify(user);
      this.setToken(userString);
      this.loggedIn.next(true);
      console.log('test')
      // this.router.navigate(['/']);
    }
  }

  /**
   * Logout the user
   */
  logout(): void {
    this.loggedIn.next(false);
    localStorage.removeItem(TOKEN_NAME);
    this.router.navigate(['/login']);
  }
}
