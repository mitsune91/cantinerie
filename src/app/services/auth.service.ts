import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { User } from '../models/User'
import { isEmpty } from 'lodash-es'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false)
  get isLoggedIn () {
    return this.loggedIn.asObservable()
  }
  constructor (private router: Router) {}

  login (user: User[]) {
    if (!isEmpty(user)) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      this.loggedIn.next(true)
      this.router.navigate(['/'])
    }
  }
  logout () {
    this.loggedIn.next(false)
    localStorage.removeItem('currentUser')
    this.router.navigate(['/login'])
  }
}
