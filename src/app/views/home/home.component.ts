import {Component, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {BaseComponent} from '../../shared/core/base.component';
import {Menu} from '../../models/Menu';
import {MenuService} from '../../services/menu.service';
import {MealService} from '../../services/meal.service';
import {HOST} from '../../../../config/app.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  weeklyMenus: any[] = [];
  selectedMenusFromDay: any[];
  date = new Date();
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  selectedDay = '';

  constructor(private menuService: MenuService, private mealService: MealService) {
    super();
  }

  ngOnInit(): void {
    this.getWeekMenus();
  }

  // Initialise le menu du jour
  initMenusOfTheDay(): void {
    if (this.weeklyMenus) {
      let today: string;
      const day = new Date().getDay().toString();
      switch (day) {
        case '1' :
          today = 'Lundi';
          break;
        case '2' :
          today = 'Mardi';
          break;
        case '3' :
          today = 'Mercredi';
          break;
        case '4' :
          today = 'Jeudi';
          break;
        case '5' :
          today = 'Vendredi';
          break;
      }
      this.selectedMenusFromDay = this.weeklyMenus.filter(w => w.day === today);
    }
  }

  // Méthode pour afficher le menu en fonction du jour choisi
  loadMenuOfSelectedDay(day: string): void {
    this.selectedDay = day;
    this.selectedMenusFromDay = this.weeklyMenus.filter(w => w.day === day);
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
          }
        });
        console.log(rawMenus);
        // rawMenus.forEach(menu => {
        //   // if (menu.length) {
        //     menu.meals.forEach(meal => {
        //       // this.loadMealImg(meal.imageId);
        //     });
        //   // }
        // });
        // On répartit les menus pour chaque jour de la semaine
        this.dispatchMenus(rawMenus);
        // Après avoir récupérer tous les menus de la semaine
        // on affiche par défaut les menus du jour
        this.initMenusOfTheDay();
      });
  }

  // Méthode pour répartir les menus disponibles de la semaine sur chaque jour
  dispatchMenus(menus: Menu[]): void {
    for (let i = 0; i < menus.length; i++) {
      let day = i;
      if (day < this.days.length) {
        const menu = {
          day: '',
          menus: []
        };
        menu.day = this.days[day];
        menu.menus.push(menus[i]);
        this.weeklyMenus.push(menu);
      } else {
        day = 0;
        this.weeklyMenus[day].menus.push(menus[i]);
      }
    }
  }

  // Méthode pour récupérer le numéro de la semaine en cours
  getWeekNumber(date: any): any {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date - Number(yearStart)) / 86400000) + 1) / 7);
    return weekNo;
  }

  // TODO Récupérer les images des meals
  loadMealImg(id: number): string {
    console.log(id);
    let pathImg = '';

    this.mealService.getMealImg(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        const mealUrl = HOST.mealUrl;
        console.log(data.id);
        console.log(data.imagePath);
        const path = data.imagePath.replace('', '%20');
        console.log(path);
        pathImg = mealUrl + data.imagePath;
        console.log(pathImg);
      });
    return pathImg;
  }

}
