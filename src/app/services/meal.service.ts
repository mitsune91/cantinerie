import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HOST} from '../../../config/app.config';
import {Observable} from 'rxjs';

export const MEAL_NAME = 'meal_name';

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
export class MealService {

  constructor(private http: HttpClient) {}

  private url: string = HOST.apiUrl;

  getMeal(): any {
    return localStorage.getItem(MEAL_NAME);
  }

  setMeal(meal: any): void {
    localStorage.setItem(MEAL_NAME, meal);
  }

  /*
   *                        Gestion des plats
   */

  getMeals(): Observable<any> {
    return this.http.get(this.url + 'meal/findall');
  }
  addMeal(body: any): Observable<any> {
    return this.http.put(this.url + 'meal/add', body);
  }
  updateMealById(mealId: number, body: any): Observable<any> {
    return this.http.patch(this.url + 'meal/update/' + mealId, body);
  }
  deleteMeal(mealId: number): Observable<any> {
    return this.http.delete(this.url + 'meal/delete/' + mealId);
  }
  getMealById(id: number): Observable<any> {
    return this.http.get(this.url + 'meal/find/' + id);
  }
  updateImgMealById(mealId: number, body: any): Observable<any> {
    return this.http.patch(this.url + 'meal/updateimg/' + mealId, body);
  }
  getMealOfTheDay(): Observable<any> {
    return;
  }
  getMealOfTheWeek(weekNumber: number): Observable<any> {
    return this.http.get(this.url + 'meal/findallavailableforweek/' + weekNumber);
  }
  getMealImg(id: number): Observable<any> {
    return this.http.get(this.url + 'meal/findimg/' + id);
  }
}
