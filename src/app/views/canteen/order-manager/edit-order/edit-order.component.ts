import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent } from '../../../../shared/core/base.component';
import { OrderService } from '../../../../services/order.service';
import { MealService } from '../../../../services/meal.service';
import { ConfirmationModalComponent } from '../../../../components/modal/confirmation-modal/confirmation-modal.component';

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
    private router: Router,
    private modalService: NgbModal
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
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.modalTitle = 'Modifier une commande';
    modal.componentInstance.message = 'Etes-vous sûr(e) de vouloir modifier cette commande ?';
    modal.componentInstance.twoButton = true;
    modal.result.then((confirmed) => {
      if (confirmed) {
        this.orderService.updateOrderById(this.editedOrder.id, body)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            const notification = this.modalService.open(ConfirmationModalComponent);
            notification.componentInstance.modalTitle = 'Modifier une commande';
            notification.componentInstance.message = 'La commande a bien été modifiée.';
            notification.componentInstance.twoButton = false;
            modal.result.then(() => {
              this.onNavigateBack();
            }).catch(() => {
            });
          }, (error => {
            if (error.status === 412) {
              const notification = this.modalService.open(ConfirmationModalComponent);
              notification.componentInstance.modalTitle = 'Modifier une commande';
              notification.componentInstance.message = 'Vous ne pouvez plus modifier la commande. L\'heure de prise de commande est dépassée.';
              notification.componentInstance.twoButton = false;
              modal.result.then(() => {
                this.onNavigateBack();
              }).catch(() => {
              });
            }
          }));
      }
    }).catch(() => {
    });
  }

  // Récupère un commande grâce à son id
  getOrderById(id: number): void {
    this.orderService.getOrderById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(order => {
        this.editedOrder = order;
        this.getOrderStatus(this.editedOrder);
      });
  }

  // Modifie le status via le formulaire
  editOrderStatus(status: any): void {
    this.form.value.status = status;
  }

  // Récupère le status de la commande
  getOrderStatus(order: any): void {
    this.orderService.status.forEach(s => {
      if (s.code === order.status) {
        this.editedOrderStatus = s.label;
      }
    });
  }

  // Récupère tous les plats disponibles
  getAllMeals(): void {
    this.mealService.getMeals()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(meals => {
        this.meals = meals;
      });
  }

  // TODO Filtrer les plats dans le formulaire pour n'afficher que les plats disponibles ce jour

}
