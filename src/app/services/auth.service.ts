import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { User } from '../models/User'
import { isEmpty } from 'lodash-es'
import { Router } from '@angular/router'

export const TOKEN_NAME: string = 'token_user'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 loggedIn = new BehaviorSubject<boolean>(false)
  get isLoggedIn () {
    return this.loggedIn.asObservable()
  }
  constructor (private router: Router) {}

  getToken (): string {
    return localStorage.getItem(TOKEN_NAME)
  }

  setToken (token: string): void {
    localStorage.setItem(TOKEN_NAME, token)
  }

  login (user: User[]) {
    if (!isEmpty(user)) {
      let userString = JSON.stringify(user)
      this.setToken(userString)
      this.loggedIn.next(true)
      this.router.navigate(['/'])
    }
  }

  logout () {
    this.loggedIn.next(false)
    localStorage.removeItem(TOKEN_NAME)
    this.router.navigate(['/login'])
  }
}
