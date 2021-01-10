import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../shared/core/base.component';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MealService } from '../../../services/meal.service';
import { ConfirmationModalComponent } from '../../../components/modal/confirmation-modal/confirmation-modal.component';

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
    private router: Router,
    private modalService: NgbModal
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

  // Supprime un plat
  deleteMeal(mealId: number): void {
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.modalTitle = 'Supprimer un plat';
    modal.componentInstance.message = 'Etes-vous sûr(e) de vouloir supprimer ce plat ?';
    modal.componentInstance.twoButton = true;
    modal.result.then((confirmed) => {
      if (confirmed) {
        this.mealService.deleteMeal(mealId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            const notification = this.modalService.open(ConfirmationModalComponent);
            notification.componentInstance.modalTitle = 'Supprimer un plat';
            notification.componentInstance.message = 'Le plat a bien été supprimé.';
            notification.componentInstance.twoButton = false;
            notification.result.then(() => {
              this.getAllMeals();
            }).catch(() => {
            });
          });
      }
    }).catch(() => {
    });
  }

  // Naviguer vers la page add meal
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

}
