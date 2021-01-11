import { Meal } from './../../models/Meal';
import { ModalComponent } from './../../components/modal/modal.component';
import { AuthService, TOKEN_NAME } from './../../services/auth.service';
import { MealService } from './../../services/meal.service';
import { MenuService } from './../../services/menu.service';
import { Menu } from './../../models/Menu';
import { User } from './../../models/User';
import { Order } from './../../models/Order';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BaseComponent } from '../../shared/core/base.component';
import { takeUntil } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HOST } from '../../../../config/app.config';
import { CardService } from '../../services/card.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../components/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent extends BaseComponent implements OnInit {

  user: User;
  order: Order;
  menu: Menu;
  meal: Meal;
  cartItems = [];
  cartTotal = 0;
  mealQuantity = 0;
  message: string;
  mealPathImg: string;
  item: any = {};
  itemsInCart = [];


  constructor(
    private userService: UserService,
    private oderService: OrderService,
    private menuService: MenuService,
    private mealService: MealService,
    private authService: AuthService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CardService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.item = this.cartService.getItems();
    console.log(this.item);
  }

  selectMeal(mealId: number): void {
    this.mealService.getMealById(mealId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.meal = data;

        // this.itemsInCart.push(this.meal)
        console.log(this.cartItems.find(i => i.id === this.meal.id));
        if (this.cartItems.find(i => i.id === this.meal.id) === undefined) {
          this.cartItems.push(this.meal);
          this.mealQuantity = this.cartItems.length;

          if (this.cartItems.length === 0) {
            // this.cartItems.push(this.meal)
            this.cartTotal = 0;
          } else {
            this.cartItems.forEach(meal => {
              // console.log(meal.priceDF)
              this.cartTotal += meal.priceDF;
            });
          }
        }
      });
  }

  deleteItem(meal: Meal): void {
    console.log(meal);
    console.log(this.cartItems);
    const index: number = this.cartItems.indexOf(meal);
    console.log(index);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.cartTotal -= meal.priceDF;
    }
  }

  onNavigateBack(): void {
    this.route.navigate(['']);
  }

  // Récupère le path image des meals
  getMealPathImg(meals): void {
    meals.forEach(meal => {
      this.mealService.getMealImg(meal.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(data => {
          const apiUrl = HOST.apiUrl;
          meal.pathImg = apiUrl + data.imagePath.split(' ').join('%20');
        });
    });
  }

  putCommandeValidation(event): void {

    // TODO - retirer le montant de carteTOTAL du userWalet
    console.log(event.target);

    let message: string;
    let quantity: Array<any> = [];
    let userConnected: any;

    event.preventDefault();
    /**
     * les vérification a mettre en place avant ge généré un ORDER
     */
    if (localStorage.getItem(TOKEN_NAME) !== null) {
      userConnected = JSON.parse(this.authService.getToken());
      console.log(userConnected);

      // Vérifier si il y a un utilisateur connecté
      if (userConnected) {
        /**
         * la suite de la verification
         */
        const userWalet: number = userConnected.wallet; // Récuperer le Solde de l'utilisateur.
        console.log(userWalet);



        if (userWalet > this.cartTotal) {
          // Faire la derniére verification avant la commande
          console.log(userWalet + 'et' + this.cartTotal);

          this.oderService.putOrder()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
              data => {
                console.log(data);
                quantity = [
                  data.quantity = this.mealQuantity, // la quantité de meal selectioné dans le menu
                  data.mealId = this.meal, // Récupere le dérnier meal selectioné
                  data.menuId = this.menu
                ];
                message = 'votre commande est validé';
                const modal = this.modalService.open(ConfirmationModalComponent);
                modal.componentInstance.modalTitle = message;
                modal.componentInstance.message = 'Felicitation votre commande est envoyé a la Cantinière';
                modal.componentInstance.twoButton = false;
                modal.result.then(() => {
                  this.route.navigate(['']);
                }).catch(() => {
                });
                // this.cartService.clearCart();

              },
              // Vérification des constrains. limitation de commande avant 10h30 et pas plus de 500 commande par jour.
              async error => {
                console.log('oops', error);
                /**
                 * Une fois l'erreur d'étecté:
                 * 1./ va chercher le moal.component
                 * 2./ Récupère les informations dans la fonction ci-dessous [modalConfig]
                 * 3./ La syncronise avec le modal content
                 */
                const modal = this.modalService.open(ConfirmationModalComponent);
                modal.componentInstance.modalTitle = 'Une erreur s\'est produit durant de la validation du panier';
                modal.componentInstance.message = 'L\'heure authorisée pour passer une commande est dépassée';
                modal.componentInstance.twoButton = false;
                modal.result.then(() => {
                  this.route.navigate(['/login']);
                }).catch(() => {
                });

                // Retour a la page d'accueil.
                this.route.navigate(['']);
                // this.cartService.clearCart();
              });

        } else {
          // message = pas assez de fond
          // tout annulé
          const modal = this.modalService.open(ConfirmationModalComponent);
          modal.componentInstance.modalTitle = 'Une erreur s\'est produit durant de la validation du panier';
          modal.componentInstance.message = 'Pas assez de fond. ' + '\n' + 'Se renseigné au près de la cantiniere!';
          modal.componentInstance.twoButton = false;
          modal.result.then(() => {
            this.route.navigate(['']);
          }).catch(() => {
          });

        }
      } else {
        // Si Non redirection
        const modal = this.modalService.open(ConfirmationModalComponent);
        modal.componentInstance.modalTitle = 'Une erreur s\'est produit durant de la validation du panier';
        modal.componentInstance.message = 'Connectez-vous avant de passer une commande!';
        modal.componentInstance.twoButton = false;
        modal.result.then(() => {
          this.route.navigate(['/login']);
        }).catch(() => {
        });
      }
    } else {
      const modal = this.modalService.open(ConfirmationModalComponent);
      modal.componentInstance.modalTitle = 'Une erreur s\'est produit durant de la validation du panier';
      modal.componentInstance.message = 'Connectez-vous avant de passer une commande!';
      modal.componentInstance.twoButton = false;
      modal.result.then(() => {
        this.route.navigate(['/login']);
      }).catch(() => {
      });
    }
  }


}
