import { Menu } from './../models/Menu';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

let itemsInCart = [];
let cart = [];

@Injectable({
  providedIn: 'root'
})


export class CardService {
  subject = new Subject<any>();

  constructor() { }

  menu: Menu;
  items: any;


  addToCart(menu: Menu) {
  let local_storage: any[];

    let itemsInCart = []
    this.items = {
      menu,
      quantity: 1,
    }
    if(localStorage.getItem('cart')  == null){
      local_storage =[];
      console.log("LOCALSTORAGE NULL",JSON.parse(localStorage.getItem('cart')));
      itemsInCart.push(this.items);
      localStorage.setItem('cart', JSON.stringify(itemsInCart));
      console.log('Pushed first Item: ', itemsInCart);
    }
    else
    {
      local_storage = JSON.parse(localStorage.getItem('cart'));
      console.log("LOCAL STORAGE HAS ITEMS",JSON.parse(localStorage.getItem('cart')));
      for(var i in local_storage)
      {
        console.log(local_storage[i].menu.id);
        if(this.items.menu.id == local_storage[i].menu.id)
        {
          local_storage[i].quantity += 1;
          console.log("Quantity for "+i+" : "+ local_storage[i].quantity);
          console.log('same menu! index is ', i);
          this.items=null;
          break;
        }
    }
    if(this.items){
      itemsInCart.push(this.items);
    }
    local_storage.forEach(function (item){
      itemsInCart.push(item);
    })
    localStorage.setItem('cart', JSON.stringify(itemsInCart));

    }
  }

  getItems(){
   console.log("Cart: ", JSON.parse(localStorage.getItem('cart')));
   return this.items = JSON.parse(localStorage.getItem('cart'));

   //return this.items =
  }
  deleteItem(item){
    item = item;
    console.log("Deleting : ",item);
    let shopping_cart;
    let index;
    shopping_cart = JSON.parse(localStorage.getItem('cart'));
    for(let i in shopping_cart){
      if (item.menu.name == shopping_cart[i].menu.name)
      {
        index = i;
        console.log(index);
      }
    }
    shopping_cart.splice(index, 1);
    console.log("shopping_cart ", shopping_cart);
    localStorage.setItem('cart', JSON.stringify(shopping_cart));

  }
  numberOfItems(){
    let itemsInCart = JSON.parse(localStorage.getItem('cart'));
    return itemsInCart.length;
  }
  clearCart() {
    localStorage.clear();
  }
}
