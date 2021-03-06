import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import {BaseComponent} from '../../shared/core/base.component';
import {Menu} from '../../models/Menu';
import {MenuService} from '../../services/menu.service';
import {MealService} from '../../services/meal.service';
import {HOST} from '../../../../config/app.config';
import { CardService } from 'src/app/services/card.service';

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
  weekNumber: number;

  constructor(
    private menuService: MenuService,
    private mealService: MealService,
    public route: Router,
    private cartService: CardService
  ) {
    super();
  }

  ngOnInit(): void {
    this.weekNumber = this.getWeekNumber(this.date);
    this.getMenusOfTheWeek(this.getWeekNumber(this.date));
    console.log(this.weekNumber);
    // clear localStorage cart;
    // this.cartService.clearCart();
  }

  addToCart(menu): void {
    this.cartService.addToCart(menu);
    window.alert('Your product has been added to the cart!');
    this.route.navigate(['/panier']);
  }

  // Méthode pour récupérer le numéro de la semaine en cours
  getWeekNumber(date: any): any {
    date = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    let weekNo = Math.ceil(((date - Number(yearStart)) / 86400000 + 1) / 7);
    if (weekNo > 52) {
      weekNo = weekNo - 52;
    }
    return weekNo;
  }

  // Récupère tous les menus disponibles de la semaine courante
  getMenusOfTheWeek(weekNumber: number): void {
    let rawMenus;
    this.menuService
      .getMenuOfTheWeek(weekNumber)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        rawMenus = data;
        // Récupère les images des meals
        this.loadMealsImgFromMenu(rawMenus);
        // Répartit les meals pour chaque jour de la semaine
        this.dispatchMenus(rawMenus);
        // Affiche par défaut les menus du jour
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

  // Initialise le menu du jour
  initMenusOfTheDay(): void {
    if (this.weeklyMenus.length) {
      let today: string;
      const day = new Date().getDay().toString();
      console.log(day);
      switch (day) {
        case '1':
          today = 'Lundi';
          break;
        case '2':
          today = 'Mardi';
          break;
        case '3':
          today = 'Mercredi';
          break;
        case '4':
          today = 'Jeudi';
          break;
        case '5':
          today = 'Vendredi';
          break;
      }
      this.selectedMenusFromDay = this.weeklyMenus.filter(w => w.day === today);
      console.log(this.selectedMenusFromDay);
    }
  }

  // Méthode pour afficher le menu en fonction du jour choisi
  loadMenuOfSelectedDay(day: string): void {
    this.selectedDay = day;
    this.selectedMenusFromDay = this.weeklyMenus.filter(w => w.day === day);
  }

  // Récupère les images d'un menu
  loadMealsImgFromMenu(menus: any): void {
    menus.forEach(menu => {
      // On vérifie que le menu contient bien des meals
      if (menu.hasOwnProperty('meals')) {
        menu.meals.forEach(meal => {
          this.mealService
            .getMealImg(meal.id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => {

              const apiUrl = HOST.apiUrl;
              meal.pathImg = apiUrl + data.imagePath.split(' ').join('%20');
            });
        });

      }
    });
  }
}
