import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BaseComponent} from '../../../../shared/core/base.component';
import {takeUntil} from 'rxjs/operators';
import {MealService} from '../../../../services/meal.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HOST} from '../../../../../../config/app.config';

@Component({
  selector: 'app-edit-meal',
  templateUrl: './edit-meal.component.html',
  styleUrls: ['./edit-meal.component.scss']
})
export class EditMealComponent extends BaseComponent implements OnInit {

  editedMeal: any = {};
  mealId: number;
  mealPathImg: string;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    private fb: FormBuilder
    ) {
    super();

    this.form = this.fb.group({
      id: [''],
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
    // Récupère l'id du plat dans l'url
    // pour récupérer le plat dans la BDD
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: any) => {
        const id = params.get('id');
        this.mealId = Number(id); // Cast string into number
        this.getMealById(this.mealId);
        this.getMealPathImgById(this.mealId);
      });
  }

  // Récupère un plat grâce à son id
  getMealById(id: number): void {
    this.mealService.getMealById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(meal => {
        this.editedMeal = meal;
        console.log(this.editedMeal);
        this.form.patchValue(this.editedMeal); // On insère les valeurs du plats dans le formulaire
      });
  }

  getMealPathImgById(id: number): void {
    this.mealService.getMealImg(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        console.log(data);
        const apiUrl = HOST.apiUrl;
        this.mealPathImg = apiUrl + data.imagePath.split(' ').join('%20');
        console.log(this.mealPathImg);
      });
  }

  getValue(status: string): void {
    console.log(this.form.value.status);
  }

  // The category for this element. unknown(0), appetizers(1), starters(2),
  // main_dishes(3), others(4), desserts(5), brunchs_and_lunches(6),
  // soups(7), sauces(8), drinks(9), sandwiches(10), snacks(11)

  // The status for this element.
  // 0 for Enabled, 1 for Disabled, 2 for Deleted
}
