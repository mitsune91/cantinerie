import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {debounceTime, takeUntil} from 'rxjs/operators';

import {BaseComponent} from '../../../shared/core/base.component';
import {OrderService} from '../../../services/order.service';

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
        this.filterOrders(this.orders);
      });
  }

  // Filtre grâce à la Subscription (Observalble)
  filterOrders(meals: any): void {
    this.orderFilter.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe), debounceTime(700))
      .subscribe(key => {
        if (key) {
          this.getFilterMealsData(meals, key);
        } else {
          this.filteredOrders = this.orders;
        }
      });
  }

  // Récupère des plats en fonction des lettres tapées dans le filtre
  getFilterMealsData(orders: any, key: string): void {
    this.filteredOrders = orders.filter(o => o.user.firstname.toLowerCase().includes(key) || o.user.name.toLowerCase().includes(key));
  }

  // Envoie vers la page de prise de commande
  onAddOrder(): void {
    this.router.navigate(['canteen/orders/add']);
  }

  // Envoie vers la page d'édition d'une commande
  onEditOrder(orderId: number): void {
    this.router.navigate(['canteen/orders/edit', orderId]);
  }

  // TODO Méthode ne fonctionne pas encore... A travailler
  // TODO Ajouter modal pour confirmer l'annulation
  // Annule une commande
  cancelOrder(order: any): void {
    this.orderService.cancelOrderById(order.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  // Naviguer entre les différents menus
  onSelectedMenu(section: string): void {
    switch (section) {
      case 'Gestion des plats':
        this.router.navigate(['canteen/meals']);
        break;
      case 'Gestion des commandes':
        this.router.navigate(['canteen/orders']);
        break;
      case 'Gestion des utilisateurs':
        this.router.navigate(['canteen/users']);
        break;
    }
  }

  // TODO Ajouter un filtre date
  // TODO Ajouter filtre status avec un select
  //  (0: Created, 1: Delivered, 2: Canceled)
  // TODO Afficher dans le tableau si la commande a été payée ou non
  // TODO Ajouter une checkbox pour notifier si la commande est livrée ou non

}
