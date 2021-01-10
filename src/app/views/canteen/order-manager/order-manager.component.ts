import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent } from '../../../shared/core/base.component';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import { ConfirmationModalComponent } from '../../../components/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.scss']
})
export class OrderManagerComponent extends BaseComponent implements OnInit {

  canteenMenus = ['Gestion des plats', 'Gestion des commandes', 'Gestion des utilisateurs'];
  orders: any = [];
  filteredOrders: any = [];
  orderFilter = new FormControl('');

  constructor(
    private orderService: OrderService,
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllOrders();
  }

  // Récupère toutes les commandes
  getAllOrders(): void {
    this.orderService.getOrders()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(orders => {
        this.orders = orders;
        this.filteredOrders = this.orders;
        this.filterOrders(this.orders);
        console.log(this.filteredOrders);
      });
  }

  // Filtre grâce à la Subscription (Observalble)
  filterOrders(meals: any): void {
    this.orderFilter.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe), debounceTime(700))
      .subscribe(key => {
        if (key) {
          this.getFilterOrdersData(meals, key);
        } else {
          this.filteredOrders = this.orders;
        }
      });
  }

  // Récupère les commandes par nom et prénom en fonction des lettres tapées dans le filtre
  getFilterOrdersData(orders: any, key: string): void {
    this.filteredOrders = orders.filter(o => o.user.firstname.toLowerCase().includes(key) || o.user.name.toLowerCase().includes(key));
  }

  // Envoie vers la page de prise de commande
  onAddOrder(): void {
    this.router.navigate(['canteen/orders/add']);
  }

  // Envoie vers la page d'édition d'une commande
  onEditOrder(orderId: number): void {
    this.router.navigate(['canteen/orders/edit', orderId]);
  }

  // Annule une commande
  cancelOrder(order: any): void {
    console.log(order);
    // On recrédite l'utilisateur
    const amountCredited = order.quantity[0].meal.priceDF * order.quantity[0].quantity;
    this.creditUser(order.user, amountCredited);
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.modalTitle = `CMD n° ${order.id} : ${order.user.name} ${order.user.firstname}`;
    modal.componentInstance.message = 'Etes-vous sûr(e) de vouloir annuler cette commande ?';
    modal.componentInstance.twoButton = true;
    modal.result.then((confirmed) => {
      if (confirmed) {
        // Puis on supprime la commande
        this.orderService.cancelOrderById(order.id)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            const notification = this.modalService.open(ConfirmationModalComponent);
            notification.componentInstance.modalTitle = `CMD n° ${order.id} : ${order.user.name} ${order.user.firstname}`;
            notification.componentInstance.message = 'La commande a bien été annulée.';
            notification.componentInstance.twoButton = false;
            modal.result.then(() => {
              this.getAllOrders();
            }).catch(() => {
            });
          });
      }
    }).catch(() => {
    });
  }

  // Naviguer entre les différents menus
  onSelectedMenu(section: string): void {
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

  // Créditer utilisateur
  creditUser(user: any, amount: number): void {
    this.userService.creditUsersWallet(user.id, {
      wallet: amount
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(d => console.log(d));
  }

  // TODO Ajouter un filtre date
  // TODO Ajouter filtre status avec un select
  //  (0: Created, 1: Delivered, 2: Canceled)

}
