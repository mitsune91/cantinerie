import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

import {MealService} from '../../../../services/meal.service';
import {IngredientService} from '../../../../services/ingredient.service';
import {BaseComponent} from '../../../../shared/core/base.component';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent extends BaseComponent implements OnInit {

  form: FormGroup;
  ingredients: any = [];
  mealCategories = this.ingredientService.categories;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private mealService: MealService,
    private ingredientService: IngredientService
  ) {
    super();

    this.form = this.fb.group({
      label: [''],
      priceDF: [''],
      imageId: [''],
      ingredients: [''],
      category: [''],
      availableForWeeks: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.getAllIngredients();
  }

  // Récupère tous les ingrédients disponibles
  getAllIngredients(): void {
    this.ingredientService.getIngredients()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(ingredients => {
        this.ingredients = ingredients;
      });
  }

  // Modifie le status via le formulaire
  addMealStatus(status: any): void {
    this.form.value.status = status;
  }

  // Envoie les changements du formulaire
  submitAddedMeal(): void {
    const body = this.form.value;
    const availabilities: any = [];
    const availabilitiesData = this.form.value.availableForWeeks.split(','); // Cast string en tableau de string
    // On cast le tableau de string en tableau de number
    availabilitiesData.forEach(a => {
      const numberData = Number(a);
      availabilities.push(numberData);
    });
    body.availableForWeeks = availabilities;
    this.mealService.addMeal(body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  // Permet de revenir à la page de gestion des plats
  onNavigateBack(): void {
    this.router.navigate(['canteen/meals']);
  }

  // TODO Changer le système des disponibilités
  // TODO Améliorer le select des ingrédients
  // TODO Permettre l'update d'image
}
