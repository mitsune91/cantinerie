import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HOST} from '../../../config/app.config';

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
export class ForgottenPasswordService {

  constructor(private http: HttpClient) {}

  private url: string = HOST.apiUrl;

  /*
   *                        Mot de passe oublié
   */

  sendMailForPassword(): Observable<any> {
    return;
  }
}
