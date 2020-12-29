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
  isMealSummaryDisplayed = true;
  totalOrders: number;
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
        console.log(this.ordersOfTheDay);
        // this.getOrdersSummary(this.ordersOfTheDay);
      });
  }

  // getOrdersSummary(orders: any): void {
  //   console.log(orders);
  //   this.totalOrders = orders.length;
  //   orders.forEach(order => {
  //     if (order.hasOwnProperty('quantity')) {
  //       order.quantity.forEach(mealData => {
  //         const mealOrdered: any = {};
  //         // console.log(mealData);
  //         if (this.numberOfMeals.length) {
  //           this.numberOfMeals.forEach(n => {
  //             if (n.meal !== mealData.meal.label) {
  //               mealOrdered.meal = mealData.meal.label;
  //               mealOrdered.quantity = 1;
  //               this.numberOfMeals.push(mealOrdered);
  //               // n.quantity++;
  //             } else {
  //               // mealOrdered.meal = mealData.meal.label;
  //               // mealOrdered.quantity = 1;
  //               // this.numberOfMeals.push(mealOrdered);
  //             }
  //           });
  //         } else {
  //           mealOrdered.meal = mealData.meal.label;
  //           mealOrdered.quantity = 1;
  //           this.numberOfMeals.push(mealOrdered);
  //         }
  //         // if (!this.numberOfMeals.includes(mealData.meal.label)) {
  //         //   mealOrdered.meal = mealData.meal.label;
  //         //   mealOrdered.quantity = 1;
  //         //   this.numberOfMeals.push(mealOrdered);
  //         // } else {
  //         //   this.numberOfMeals.forEach(searchedMeal => {
  //         //     if (searchedMeal.meal === mealData.meal.label) {
  //         //       searchedMeal.quantity++;
  //         //     }
  //         //   });
  //         // }
  //       });
  //     }
  //   });
  //   console.log(this.numberOfMeals);
  // }

  // Naviguer entre les différents menus
  onSelectedMenu(section: string): void {
    console.log(section);
    switch (section) {
      case 'Gestion des plats':
        this.router.navigate(['canteen/meals']);
        break;
      case '"Gestion des commandes"':
        this.router.navigate(['canteen/orders']);
        break;
      case 'Gestion des utilisateurs':
        this.router.navigate(['canteen/users']);
        break;
    }
  }

  summaryToggle(): void {
    this.isMealSummaryDisplayed = !this.isMealSummaryDisplayed;
    console.log(this.isMealSummaryDisplayed);
  }

}
