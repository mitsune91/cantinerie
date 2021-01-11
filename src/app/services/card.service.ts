import { Menu } from './../models/Menu';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class CardService {
  subject = new Subject<any>();

  constructor() {
  }

  menu: Menu;
  item: any;


  addToCart(menu: Menu): void {
    localStorage.clear();
    this.item = menu;
    localStorage.setItem('cart', JSON.stringify(this.item));
  }

  getItems(): any {
    return this.item = JSON.parse(localStorage.getItem('cart'));
  }

  // numberOfItems(): number {
  //   const itemsInCart = JSON.parse(localStorage.getItem('cart'));
  //   return itemsInCart.length;
  // }

  clearCart(): void {
    localStorage.clear();
  }
}
