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
export class IngredientService {

  categories = [
    { code : 0, label: 'Inconnu' },
    { code : 1, label: 'Apéritif' },
    { code : 2, label: 'Entrée' },
    { code : 3, label: 'Plat principal' },
    { code : 4, label: 'Autre' },
    { code : 5, label: 'Dessert' },
    { code : 6, label: 'Brunch et déjeuner' },
    { code : 7, label: 'Soupe' },
    { code : 8, label: 'Sauce' },
    { code : 9, label: 'Boisson' },
    { code : 10, label: 'Sandwich' },
    { code : 11, label: 'Snack' },
  ];

  status = [
    { code: 0, label: 'Actif' },
    { code: 1, label: 'Inactif' },
    { code: 2, label: 'Supprimé' }
  ];

  constructor(private http: HttpClient) { }

  private url: string = HOST.apiUrl;

  /*
   *                        Gestion des ingrédients
   */

  getIngredients(): Observable<any> {
    return this.http.get(this.url + 'ingredient/findall');
  }

  putIngredient(): Observable<any> {
    return ;
  }
  updateIngredient(): Observable<any> {
    return;
  }
  deleteIngredient(): Observable<any> {
    return;
  }
  getIngredient(): Observable<any> {
    return;
  }
  updateImgIngredient(): Observable<any> {
    return;
  }
  getIngredientImgById(): Observable<any> {
    return;
  }
}
