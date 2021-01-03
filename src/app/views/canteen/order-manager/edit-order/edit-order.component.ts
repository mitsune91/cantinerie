import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {take, takeUntil} from 'rxjs/operators';

import {BaseComponent} from '../../../../shared/core/base.component';
import {OrderService} from '../../../../services/order.service';
import {MealService} from '../../../../services/meal.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent extends BaseComponent implements OnInit {

  editedOrder: any = {};
  orderId: number;
  editedOrderCategory: string;
  editedOrderStatus: string;
  meals: any = [];
  isFormDisplayed = false;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private mealService: MealService,
    private fb: FormBuilder,
    private router: Router
  ) {
    super();

    this.form = this.fb.group({
      id: [''],
      quantity: [''],
      mealId: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    // Récupère l'id du commande dans l'url
    // pour récupérer le commande dans la BDD
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: any) => {
        const id = params.get('id');
        this.orderId = Number(id); // Cast string into number
        this.getOrderById(this.orderId);
      });
    this.getAllMeals();
    console.log(this.editedOrder);
  }

  // Permet d'afficher le formulaire permettant de modifier un plat
  displayForm(): void {
    this.isFormDisplayed = !this.isFormDisplayed;
  }

  // Permet de revenir à la page de gestion des commandes
  onNavigateBack(): void {
    this.router.navigate(['canteen/orders']);
  }

  // Envoie les changements du formulaire
  submitEditedOrder(): void {
    const body = {
      userId: this.editedOrder.user.id,
      // Décommenter constraintId = -1 pour tester la requête
      // constraintId: -1,
      quantity: [
        {
          quantity: Number(this.form.value.quantity),
          mealId: this.form.value.mealId,
        }
      ]
    };
    console.log(body);
    this.orderService.updateOrderById(this.editedOrder.id, body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  // Récupère un commande grâce à son id
  getOrderById(id: number): void {
    this.orderService.getOrderById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(order => {
        this.editedOrder = order;
        console.log(this.editedOrder);
        console.log(this.editedOrder.quantity[0].quantity);
        this.getOrderStatus(this.editedOrder);
      });
  }

  // Modifie le status via le formulaire
  editOrderStatus(status: any): void {
    this.form.value.status = status;
    console.log(this.form.value.status);
  }

  // Récupère le status de la commande
  getOrderStatus(order: any): void {
    this.orderService.status.forEach(s => {
      if (s.code === order.status) {
        this.editedOrderStatus = s.label;
        console.log(this.editedOrderStatus);
      }
    });
  }

  // Récupère tous les plats disponibles
  getAllMeals(): void {
    this.mealService.getMeals()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(meals => {
        this.meals = meals;
        console.log(this.meals);
      });
  }

  // TODO Filtrer les plats dans le formulaire pour n'afficher que les plats disponibles ce jour

}
