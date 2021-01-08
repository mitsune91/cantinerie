import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../../services/order.service';
import {BaseComponent} from '../../../shared/core/base.component';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-canteen-summary',
  templateUrl: './canteen-summary.component.html',
  styleUrls: ['./canteen-summary.component.scss']
})
export class CanteenSummaryComponent extends BaseComponent implements OnInit {

  canteenMenus = ['Gestion des plats', 'Gestion des commandes', 'Gestion des utilisateurs'];
  ordersOfTheDay: any;
  day = new Date(2020, 9, 2);
  isMealSummaryDisplayed = false;
  totalOrders = 0;
  numberOfMeals: any[] = [];

  constructor(
    private orderService: OrderService,
    public router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getOrdersOfTheDay();
  }

  // Récupère les commandes du jour
  getOrdersOfTheDay(): void {
    this.orderService.getOrders()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        // On récupère le numéro du jour
        let numberDay = this.day.getDate().toString();
        // On ajoute un '0' devant pour pouvoir filtrer
        if (this.day.getDate() < 10) {
          numberDay = '0' + this.day.getDate();
        }
        // On récupère le numéro du mois et on lui ajoute 1
        const mois = this.day.getMonth() + 1;
        // On créé un string de la date du jour pour récupérer les commandes du jour
        const date = this.day.getFullYear() + '-' + mois + '-' + numberDay;
        this.ordersOfTheDay = data.filter(d => d.creationDate === date);
        this.getOrdersSummary(this.ordersOfTheDay);
      });
  }

  // Récupère le détail des quantité par plats
  getOrdersSummary(orders: any): void {
    const ordersAndQuantities: any = [];
    orders.forEach(order => {
      if (order.hasOwnProperty('quantity')) {
        const mealOrdered: any = {};
        mealOrdered.meal = order.quantity[0].meal.label;
        mealOrdered.quantity = order.quantity[0].quantity;
        ordersAndQuantities.push(mealOrdered);
      }
    });
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < ordersAndQuantities.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = i + 1; j < ordersAndQuantities.length; j++) {
        if (ordersAndQuantities[i].meal === ordersAndQuantities[j].meal) {
          ordersAndQuantities[i].meal = ordersAndQuantities[j].meal;
          ordersAndQuantities[i].quantity = ordersAndQuantities[i].quantity + ordersAndQuantities[j].quantity;
          ordersAndQuantities.splice(j, 1);
        }
      }
    }
    this.numberOfMeals = ordersAndQuantities;
    this.getTotalMealsPerDay(this.numberOfMeals);
  }

  // Récupère le nombre total de plats commandé ce jour
  getTotalMealsPerDay(orders: any): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < orders.length; i++) {
      this.totalOrders += orders[i].quantity;
    }
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

  // Permet de cacher la partie récapitulatif de commande
  summaryToggle(): void {
    this.isMealSummaryDisplayed = !this.isMealSummaryDisplayed;
  }

  // TODO A travailler : Voir orderService
  payAndDeliverOrder(order: any): void {
    this.orderService.payAndDeliverOrder()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  editOrder(order: any): void {
    this.router.navigate(['canteen/orders/edit/', order.id]);
  }

  deleteOrder(order: any): void {
    this.orderService.cancelOrderById(order.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

}
