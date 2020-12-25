import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../../services/order.service';
import {BaseComponent} from '../../../shared/core/base.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-canteen-summary',
  templateUrl: './canteen-summary.component.html',
  styleUrls: ['./canteen-summary.component.scss']
})
export class CanteenSummaryComponent extends BaseComponent implements OnInit {

  orderOfTheDay: any;
  day = new Date();

  constructor(private orderService: OrderService) {
    super();
  }

  ngOnInit(): void {
    this.getOrdersOfTheDay();
  }

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
        this.orderOfTheDay = data.filter(d => d.creationDate === date);
        console.log(this.orderOfTheDay);
      });
  }

}
