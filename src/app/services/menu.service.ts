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
export class MenuService {

  constructor(private http: HttpClient) { }

  private url: string = HOST.apiUrl;

  /*
   *                        Gestion des menus
   */

  getMenus(): Observable<any> {
    return this.http.get(this.url + 'menu/findall');
  }

  putMenu(): Observable<any> {
    return ;
  }
  updateMenu(): Observable<any> {
    return;
  }
  deleteMenu(): Observable<any> {
    return;
  }
  getMenu(): Observable<any> {
    return;
  }
  updateImgMenu(): Observable<any> {
    return;
  }
  // Méthode findallavailablefortoday de l'api ne fonctionne pas.
  // Renvoie tous les menus de la semaine. Ne pas utiliser !!
  // getMenuOfTheDay(): Observable<any> {
  //   return this.http.get(this.url + 'menu/findallavailablefortoday');
  // }
  getMenuOfTheWeek(weekNumber: number): Observable<any> {
    return this.http.get(this.url + 'menu/findallavailableforweek/' + weekNumber);
  }
  getImgMenu(): Observable<any> {
    return;
  }
}
