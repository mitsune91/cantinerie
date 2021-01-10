import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HOST } from '../../../config/app.config';

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

  status = [
    { code: 0, label: 'Activé'},
    { code: 1, label: 'Désactivé'},
    { code: 2, label: 'Supprimé'}
  ];

  sex = [
    { code: 0, label: 'Homme'},
    { code: 1, label: 'Femme'},
    { code: 2, label: 'Autre'}
  ];

  constructor(private http: HttpClient) {}

  private url: string = HOST.apiUrl;

  get urlApi(): string {
    return this.url;
  }
  /*
   *                        Gestion des utilisateurs
   */

  getUsers(): Observable<any> {
    return this.http.get(this.url + 'user/findall');
  }

  putUser(body: any): Observable<any> {
    return this.http.put(this.url + 'user/register', body);
  }

  updateUser(body: any): Observable<any> {
    return this.http.patch(this.url + 'user/update/' + body.id, body);
  }
  deleteUserById(userId: number): Observable<any> {
    return this.http.delete(this.url + 'user/delete/' + userId);
  }
  /**
   * Recherche une utilisatuer par son numéro d'identifiaction.
   *
   * @param [integer] :id
   * @return [Object] retourne un objet type User
   */
  getUserById(id: number): Observable<any> {
    return this.http.get(this.url + 'user/find/' + id);

  }
  updateImgUser(): Observable<any> {
    return;
  }
  debitUsersWallet(): Observable<any> {
    return;
  }
  creditUsersWallet(userId: number, body: any): Observable<any> {
    return this.http.post(this.url + 'user/credit/' + userId + '?amount=' + body.wallet , body);
  }

  getImgUser(id: number): Observable<any> {
    return this.http.get(this.url + 'user/findimg/' + id);
  }
  desactivateUserById(): Observable<any> {
    return;
  }
  activateUserById(): Observable<any> {
    return;
  }
}
