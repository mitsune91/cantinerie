import { MealService } from './../../services/meal.service';
import { MenuService } from './../../services/menu.service';
import { Menu } from './../../models/Menu';
import { User } from './../../models/User';
import { Order } from './../../models/Order';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BaseComponent } from '../../shared/core/base.component';
import { takeUntil } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meal } from '../../models/Meal';



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


  constructor(
    private userService: UserService,
    private oderService: OrderService,
    private menuService: MenuService,
    private mealService: MealService,
    private route: Router,
    private activatedRoute: ActivatedRoute) {
      super();
    }

  ngOnInit(): void {

    /**
     * Récupération de l'identifiant passer dans l'URL {idMenu}
     *
     * Passer le paramèttre dans le fontion qui suit
     */
    const idMenu: number = parseInt(this.activatedRoute.snapshot.paramMap.get('idMenu'));


    // Résupération du menu par le numéro d'identifiant
    this.getMenuForCard(idMenu);

    /**
     * Recuperation de l'identidiant de L'utilisateur connecté
     * pour la suite rajouté le token de lutilisateur pour verification.
     *
     * Passer le paramèttre dans le fontion qui suit
     */
    this.getUserConnected(5); // l'dentifiant a être modifié avec les information de thomas

  }

  async getUserConnected(id: number): Promise<void>{
    // Appel au service UserService
    this.userService.getUser(id)
    // Tant que la page n'est pas détruite,
    .pipe(takeUntil(this.ngUnsubscribe))
    // on souscrit à l'observable ou à la méthode getUser()
    .subscribe(data => {
      // on stocke les données dans une variable pour les réutiliser
      this.user = data;
      // console.log(this.user.id);
      return this.user.id.toString;
      });


  }

  getMenuForCard(idMenu: number): void{
    /**
     * Appel su menu pa r le service menuService
     */
    this.menuService.getMenu(idMenu)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(data => {
      this.menu = data;

    });
  }

  getTotalCard(event): number{
     const isChecked = event.target.checked; // Listener des evenement en cliquant sur le boutton validé la commande
     const price = parseFloat(event.target.value); // <<parseFloat>> car le prix est decimal

     const mealId: number = event.target.id; // Récupération de l'identifiant du meal selectionée.

     /**
      * Résupération du MEAL par le mealService
      */
     this.mealService.getMeal(mealId)
     .pipe(takeUntil(this.ngUnsubscribe))
     .subscribe(data => {
       this.meal = data;
       // console.log(this.meal);
     });

     if (isChecked){
      this.cartTotal += price;
      this.mealQuantity ++; // ajouté le nombre de meal selectioné dans le menu
     } else if (!isChecked) {
       this.cartTotal -= price;
       this.mealQuantity --; // retirer le nombre de meal déselectioné dans le menu
     }

     return this.cartTotal;
  }

  putCommandeValidation(event) {

    // TODO - A faire - une tableau de meal pour le data.mealId - car plusieur meal selectioné et c'est pas géré dans la BDD
    // TODO - retirer le montant de carteTOTAL du userWalet
      console.log(event.target);

      let message: string;
      let quantity: Array<any> = [];

      event.preventDefault();
      /**
       * les vérification a mettre en place avant ge généré un ORDER
       */

       // A VOIR AVEC THOMAS D'ABORD
       // Vérifier si il y a un utilisateur connecté
      if (this.user){
        /**
         * la suite de la verification
         */

        // Vérifié si l'utilisateur a asseé d'argent dans son walet
        const userConnected: User = this.user;
        const userWalet: number = this.user.wallet; // Récuperer le Solde de l'utilisateur.
        console.log(userWalet);

        /**
         * Initialization le prix par defaut par le prix du menu
         */
        if (this.cartTotal === 0) {
        this.cartTotal = this.menu.priceDF; // Prix par default
        }

        if (userWalet > this.cartTotal) {
            // Faire la derniére verification avant la commande
            console.log(userWalet + 'et' + this.cartTotal);

            this.oderService.putOrder()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
              data => {
                console.log(data);
                quantity = [
                  data.quantity =  this.mealQuantity, // la quantité de meal selectioné dans le menu
                  data.mealId = this.meal, // Récupere le dérnier meal selectioné
                  data.menuId = this.menu
                ];
                message = 'votre commande est validé';

            },
              // Vérification des constrains. limitation de commande avant 10h30 et pas plus de 500 commande par jour.
              error => {
                console.log('oops', error);
                message = 'L\'heure authorisée pour passer une commande est dépassée';
                alert('L\'heure authorisée pour passer une commande est dépassée.' + '\n' + 'Passé une commande avant 10h30!');

                // Retour a la page d'accueil.
                this.route.navigate(['/']);
            });

          } else {
            // message = pas assez de fond
            // tout annulé
            message = 'Pas assez de fond ' + '\n' + 'Se renseigné au près de la cantiniere!';

            //  this.route.navigate(['/home']);
        }
      } else {
        // Si Non redirection
        message = 'Connectez-vous avant de passer une commande!';
        this.route.navigate(['/login']);
      }
      console.log(this.cartTotal);
      console.log(this.meal);
      console.log(this.mealQuantity);
      console.log(message);

  }

}
