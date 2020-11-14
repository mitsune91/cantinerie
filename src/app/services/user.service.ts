import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HOST} from '../../../config/app.config';
import {Observable} from 'rxjs';

/*
 *
 * ICI ON MET TOUS LES APPELS API !!!!
 * Toutes les méthodes nécessaires sont listées ci-dessous.
 * Il ne reste plus qu'à les coder !!
 * Pour voir à quoi correspondent les méthodes, voir le SWAGGER UI
 * sur http://localhost:8080/lunchtime une fois le back lancé.
 * Les méthodes sont dans l'ordre du SWAGGER
 *
 */

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private url: string = HOST.apiUrl;

  /*
   *                        Gestion des utilisateurs
   */

  getUsers(): Observable<any> {
    return this.http.get(this.url + '/user/findall');
  }

  putUser(): Observable<any> {
    return ;
  }
  updateUser(): Observable<any> {
    return;
  }
  deleteUser(): Observable<any> {
    return;
  }
  getUser(): Observable<any> {
    return;
  }
  updateImgUser(): Observable<any> {
    return;
  }
  debitUsersWallet(): Observable<any> {
    return;
  }
  creditUsersWallet(): Observable<any> {
    return;
  }
  getImgUser(): Observable<any> {
    return;
  }
  desactivateUserById(): Observable<any> {
    return;
  }
  activateUserById(): Observable<any> {
    return;
  }
}
