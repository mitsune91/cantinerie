import { Component, OnInit } from '@angular/core';
import {BaseComponent} from '../../../shared/core/base.component';
import {Router} from '@angular/router';
import {MealService} from '../../../services/meal.service';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-meal-manager',
  templateUrl: './meal-manager.component.html',
  styleUrls: ['./meal-manager.component.scss']
})
export class MealManagerComponent extends BaseComponent implements OnInit {

  canteenMenus = ['Gestion des plats', 'Gestion des commandes', 'Gestion des utilisateurs'];
  meals: any = [];
  filteredMeals: any = [];
  mealFilter = new FormControl('');

  constructor(
    private mealService: MealService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllMeals();
  }

  // Récupère tous les plats
  getAllMeals(): void {
    this.mealService.getMeals()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(meals => {
        this.meals = meals;
        this.filteredMeals = this.meals;
        console.log(this.meals);
        this.filterMeals(this.meals);
      });
  }

  // Filtre grâce à la Subscription (Observalble)
  filterMeals(meals: any): void {
    console.log(meals);
    this.mealFilter.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe), debounceTime(700))
      .subscribe(key => {
        if (key) {
          console.log(key);
          this.getFilterMealsData(meals, key);
        } else {
          this.filteredMeals = this.meals;
        }
      });
  }

  // Récupère des plats en fonction des lettres tapées dans le filtre
  getFilterMealsData(meals: any, key: string): void {
    console.log(key);
    this.filteredMeals = meals.filter(m => m.label.toLowerCase().includes(key));
    console.log(this.filteredMeals);
  }

  // Envoie vers la page d'édition d'un plat
  onEditMeal(mealId: number): void {
    console.log(mealId);
    this.router.navigate(['canteen/meals/edit', mealId]);
  }

  // TODO Ajouter modal pour confirmer la suppression
  // Supprime un plat
  deleteMeal(mealId: number): void {
    this.mealService.deleteMeal(mealId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onAddMeal(): void {
    this.router.navigate(['canteen/meals/add']);
  }

  // Naviguer entre les différents menus
  onSelectedMenu(section: string): void {
    console.log(section);
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
  // TODO Ajouter filtre status

}
