import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

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
export class OrderService {

  headers = new HttpHeaders({
    'Content-Type':  'application/json',
    // Authorization: 'my-auth-token'
  });
  options = this.headers ?
    {
      params: new HttpParams()
    } : {};

  status = [
    { code: 0, label: 'Créée' },
    { code: 1, label: 'Délivrée' },
    { code: 2, label: 'Annulée' },
  ];

  constructor(private http: HttpClient) { }

  private url: string = HOST.apiUrl;

  /*
   *                        Gestion des commandes
   */

  getOrders(): Observable<any> {
    return this.http.get(this.url + 'order/findall');
  }
  addOrder(body: any): Observable<any> {
    return this.http.put(this.url + 'order/add', body);
  }
  putOrder(): Observable<any> {
    return this.http.put(this.url + 'order/add', this.headers, this.options);
  }
  updateOrderById(orderId: number, body: any): Observable<any> {
    return this.http.patch(this.url + 'order/update/' + orderId, body);
  }
  cancelOrderById(orderId: number): Observable<any> {
    return this.http.patch(this.url + 'order/cancel/', orderId);
  }
  computePricesOrder(): Observable<any> {
    return;
  }
  getOrderByCriteria(params: any): Observable<any> {
    return this.http.get(this.url + 'order/findallbetweendateinstatus?status=' + params.status + '&beginDate=' + params.beginDate + '&endDate=' + params.endDate);
  }
  getOrderById(orderId: number): Observable<any> {
    return this.http.get(this.url + 'order/find/' + orderId);
  }
  payAndDeliverOrder(): Observable<any> {
    return;
  }
  getOrdersByUserAndByCriteria(): Observable<any> {
    return;
  }
}
