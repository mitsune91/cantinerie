import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

import { User } from '../models/User';
import { environment } from '../../environments/environment';

export const TOKEN_NAME = 'token_user';
export const ROLE_NAME = 'role_name';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = new BehaviorSubject<boolean>(false);
  userNotFound = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private http: HttpClient
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

  getDecodedToken(): any {
    return jwt_decode(this.getToken().replace('Bearer', '').trim());
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
      this.userNotFound.next(false);
      this.http.post(environment.apiUrl + 'login', user, {observe: 'response'})
        .subscribe((res: any) => {
          console.log(res.headers.get('Authorization').replace('Bearer', '').trim());
          const decodedHeader: any = jwt_decode(res.headers.get('Authorization').replace('Bearer', '').trim());
          this.setToken(res.headers.get('Authorization'));
          console.log(decodedHeader);
          this.setRole(decodedHeader.roles.shift());
          console.log(this.getRole());
          this.getRole() === 'ROLE_LUNCHLADY' ? this.router.navigate(['/canteen']) : this.router.navigate(['/']);
        }, (error => {
          if (error.status === 401) {
            this.userNotFound.next(true);
          }
        }));
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

  getUserNotFoundSubject(): Observable<boolean> {
    return this.userNotFound.asObservable();
  }
}
