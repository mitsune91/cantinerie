import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent } from '../../../../shared/core/base.component';
import { MealService } from '../../../../services/meal.service';
import { HOST } from '../../../../../../config/app.config';
import { IngredientService } from '../../../../services/ingredient.service';
import { ConfirmationModalComponent } from '../../../../components/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-edit-meal',
  templateUrl: './edit-meal.component.html',
  styleUrls: ['./edit-meal.component.scss']
})
export class EditMealComponent extends BaseComponent implements OnInit {

  editedMeal: any = {};
  mealId: number;
  mealPathImg: string;
  ingredients: any = [];
  mealCategories = this.ingredientService.categories;
  editedMealCategory: string;
  editedMealStatus: string;
  isFormDisplayed = false;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    private ingredientService: IngredientService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal
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
    this.getAllIngredients();
    // console.log(this.mealCategories);
    console.log(this.editedMeal);
  }

  // Récupère un plat grâce à son id
  getMealById(id: number): void {
    this.mealService.getMealById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(meal => {
        this.editedMeal = meal;
        console.log(this.editedMeal);
        this.getMealCategory(this.editedMeal);
        this.getMealStatus(this.editedMeal);
        this.form.patchValue(this.editedMeal); // On insère les valeurs du plats dans le formulaire
      });
  }

  // Récupère le path image d'un plat
  getMealPathImgById(id: number): void {
    this.mealService.getMealImg(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        const apiUrl = HOST.apiUrl;
        this.mealPathImg = apiUrl + data.imagePath.split(' ').join('%20');
      });
  }

  // Récupère la catégorie d'un plat
  getMealCategory(meal: any): void {
    this.mealCategories.forEach(cat => {
      if (cat.code === meal.category) {
        this.editedMealCategory = cat.label;
      }
    });
  }

  // Récupère len,,n, status d'un plat
  getMealStatus(meal: any): void {
    this.ingredientService.status.forEach(status => {
      if (status.code === meal.status) {
        this.editedMealStatus = status.label;
      }
    });
  }

  // Permet d'afficher le formulaire permettant de modifier un plat
  displayForm(): void {
    this.isFormDisplayed = !this.isFormDisplayed;
  }

  // Modifie le status via le formulaire
  editMealStatus(status: any): void {
    this.form.value.status = status;
  }

  // Envoie les changements du formulaire
  submitEditedMeal(): void {
    const body = this.form.value;
    body.isLunchLady = true;
    console.log(body);
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.modalTitle = 'Modifier un plat';
    modal.componentInstance.message = 'Etes-vous sûr(e) de vouloir modifier ce plat ?';
    modal.componentInstance.twoButton = true;
    modal.result.then((confirmed) => {
      if (confirmed) {
        this.mealService.updateMealById(this.editedMeal.id, body)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            const notification = this.modalService.open(ConfirmationModalComponent);
            notification.componentInstance.modalTitle = 'Modifier un plat';
            notification.componentInstance.message = 'Le plat a bien été modifié.';
            notification.componentInstance.twoButton = false;
            notification.result.then(() => {
              this.onNavigateBack();
            }).catch(() => {
            });
          });
      }
    }).catch(() => {
    });
  }

  // Récupère tous les ingrédients disponibles
  getAllIngredients(): void {
    this.ingredientService.getIngredients()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(ingredients => {
        this.ingredients = ingredients;
      });
  }

  // Permet de revenir à la page de gestion des plats
  onNavigateBack(): void {
    this.router.navigate(['canteen/meals']);
  }

  // TODO Travailler sur les disponibilités
  // TODO Faire l'update d'image
}
