import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HOST } from '../../../config/app.config';
import { Observable } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  private url: string = HOST.apiUrl;

  get urlApi(): string {
    return this.url;
  }
  /*
   *                        Gestion des utilisateurs
   */

  getUsers(): Observable<any> {
    return this.http.get(this.url + 'user/findall')
  }
<<<<<<< HEAD
/* mettre en paramettre un body de type any , cette méthode envoi un observable */
  putUser(body: any): Observable<any> {
    return this.http.put(this.url + 'user/register', body);
  }

  updateUser (): Observable<any> {
    return
=======

  putUser(): Observable<any> {
    return;
  }
  updateUser(): Observable<any> {
    return;
>>>>>>> b946409abd2cdc6a5effc2b9e4755e7f13b82e44
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
  getUser(id: number): Observable<any> {
    return this.http.get(this.url + 'user/find/' + id);

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
