import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { HOST } from '../../../config/app.config'
import { catchError } from 'rxjs/operators'

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
  constructor (private http: HttpClient) {}

  private url: string = HOST.apiUrl

  /*
   *                        Mot de passe oublié
   */

  sendMailForPassword (mail: string): Promise<any> {
    let params = new HttpParams().set('email', mail)

    return this.http.post(this.url + 'forgotpassword', params).toPromise()
  }
}
