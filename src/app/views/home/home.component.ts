import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { BaseComponent } from '../../shared/core/base.component';
import { Menu } from '../../models/Menu';
import { MenuService } from '../../services/menu.service';
import { MealService } from '../../services/meal.service';
import { HOST } from '../../../../config/app.config';

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
    public route: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.weekNumber = this.getWeekNumber(this.date);
    this.getMenusOfTheWeek(this.getWeekNumber(this.date));
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

  // Navigate on basket or 404 error
  selectMenu(id: number): void {
    console.log(id);
    if (id) {
      this.route.navigate(['/panier', id]);
    } else {
      this.route.navigate(['/404']);
      alert('panier vide!');
    }
  }
}

// TODO CSS plats edit et add page OK par Cedric
// TODO CSS commandes edit et add page Ok par cedric
// TODO CSS utilisateurs edit et add page OK par cedric

// TODO links navbar cedric OK fait
// TODO Vérifier que toutes les méthodes fonctionnent Cedric OK fait sauf pour panier et user profile
// TODO Revoir la home cedric
// TODO Ajouter password dans le formulaire edit page des utilisateurs cedric OK fait

// TODO Vérifier qu'il y a tous les filtres pour chaque tableau JM
//  (canteen-summary date picker, edit-order plats du jour, add-order plats du jour)
// TODO CSS panier JM

// TODO Ajouter des modal pour chaque actions Thomas OK par cedric
// TODO Enlever les console.log Thomas
// TODO Reset password Thomas

// TODO Docs et livrables Jordy
