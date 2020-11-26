import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../services/menu.service';
import {takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../shared/core/base.component';
import {Menu} from '../../models/Menu';
import {stringify} from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  weeklyMenus: any = [];
  date = new Date();
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  constructor(private menuService: MenuService) {
    super();
  }

  ngOnInit(): void {
    this.getWeekMenus();
  }

  // Méthode pour récupérer les menus de la semaines en cours
  getWeekMenus(): void {

    const rawMenus = [];
    const weekNumber = this.getWeekNumber(this.date);

    this.menuService.getMenus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        data.forEach(d => {
          if (d.availableForWeeks.includes(weekNumber)) {
            rawMenus.push(d);
            // console.log(this.menus);
          }
        });
      });
    console.log(rawMenus);
    this.dispatchMenus(rawMenus);
  }

  // Méthode pour répartir les menus de la semaine sur chaque jour
  dispatchMenus(menus: Menu[]): void {
    console.log(menus);
    this.days.forEach(day => {
      const dailyMenu = {
        day: undefined,
        menus: undefined
      };
      dailyMenu.day = day;
      dailyMenu.menus = menus.slice(0, 2); // A voir le slice qui ne fonctionne pas
      console.log(menus.slice(0, 2));
      this.weeklyMenus.push(dailyMenu);
    });
    console.log(this.weeklyMenus);
  }

  // Méthode pour récupérer le numéro de la semaine en cours
  getWeekNumber(date: any): any {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date - Number(yearStart)) / 86400000) + 1) / 7);
    return weekNo;
  }

}
