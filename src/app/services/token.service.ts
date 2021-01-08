import {Injectable} from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() {
  }

  // Verifie qu'un token est existant
  isToken() {
    if (localStorage.getItem('ccurrentUser')) {
      return true;
    }
  }

  // recupere le token
  getToken() {
    if (this.isToken() === true) {
      return localStorage.getItem('currentUser');
    }
  }

  // Verifie que le token est valide
  tokenIsValid() {
    if (this.isToken() === true) {
    }
  }
}
