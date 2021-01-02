import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {BaseComponent} from '../../../shared/core/base.component';
import {OrderService} from '../../../services/order.service';
import {Router} from '@angular/router';
import {debounceTime, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.scss']
})
export class OrderManagerComponent extends BaseComponent implements OnInit {

  canteenMenus = ['Gestion des plats', 'Gestion des commandes', 'Gestion des utilisateurs'];
  orders: any = [];
  filteredOrders: any = [];
  orderFilter = new FormControl('');

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllMeals();
  }

  // Récupère toutes les commandes
  getAllMeals(): void {
    this.orderService.getOrders()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(orders => {
        this.orders = orders;
        this.filteredOrders = this.orders;
        console.log(this.orders);
        // this.filterOrders(this.orders);
      });
  }

  // Filtre grâce à la Subscription (Observalble)
  filterOrders(meals: any): void {
    console.log(meals);
    this.orderFilter.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe), debounceTime(700))
      .subscribe(key => {
        if (key) {
          console.log(key);
          this.getFilterMealsData(meals, key);
        }
      });
  }

  // Récupère des plats en fonction des lettres tapées dans le filtre
  getFilterMealsData(orders: any, key: string): void {
    console.log(key);
    this.filteredOrders = orders.filter(o => o.user.firstname.toLowerCase().includes(key) || o.user.name.toLowerCase().includes(key));
    console.log(this.filteredOrders);
  }

}
