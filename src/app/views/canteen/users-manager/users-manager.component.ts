import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent } from '../../../shared/core/base.component';
import { UserService } from '../../../services/user.service';
import { ConfirmationModalComponent } from '../../../components/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-users-manager',
  templateUrl: './users-manager.component.html',
  styleUrls: ['./users-manager.component.scss']
})
export class UsersManagerComponent extends BaseComponent implements OnInit {

  canteenMenus = ['Gestion des plats', 'Gestion des commandes', 'Gestion des utilisateurs'];
  users: any = [];
  filteredUsers: any = [];
  userFilter = new FormControl('');
  walletControl = new FormControl('', Validators.required);
  editedUser: any = {};
  closeResult = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(users => {
        this.users = users;
        this.filteredUsers = this.users;
        this.filterUsers(this.users);
      });
  }

  // Filtre grâce à la Subscription (Observalble)
  filterUsers(users: any): void {
    this.userFilter.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe), debounceTime(700))
      .subscribe(key => {
        if (key) {
          this.filterUsersByName(users, key);
        } else {
          this.filteredUsers = this.users;
        }
      });
  }

  // Récupère des utilisateurs en fonction des lettres tapées dans le filtre
  filterUsersByName(users: any, key: string): void {
    this.filteredUsers = users.filter(u => u.firstname.toLowerCase().includes(key) || u.name.toLowerCase().includes(key));
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

  // Envoie vers la page de création d'utilisateur
  onAddUser(): void {
    this.router.navigate(['canteen/users/add']);
  }

  // Envoie vers la page d'édition d'un utilisateur
  onEditUser(userId: number): void {
    this.router.navigate(['canteen/users/edit', userId]);
  }

  // Ouvre une modal pour créditer un utilisateur
  onManageUserWallet(content: any, user: any): void {
    this.editedUser = user;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
      this.creditUserWallet(user, this.walletControl.value);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // Permet de fermer la modal en appuyant sur ESC
  // ou en cliquant en dehors de celle-ci
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // Efface un utilisateur
  deleteUser(user: any): void {
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.modalTitle = `${user.name} ${user.firstname}`;
    modal.componentInstance.message = 'Etes-vous sûr(e) de vouloir supprimer cet utilisateur ?';
    modal.componentInstance.twoButton = true;
    modal.result.then((confirmed) => {
      if (confirmed) {
        this.userService.deleteUserById(user.id)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            const notification = this.modalService.open(ConfirmationModalComponent);
            notification.componentInstance.modalTitle = `${user.name} ${user.firstname}`;
            notification.componentInstance.message = 'L\'utilisateur a bien été supprimé.';
            notification.componentInstance.twoButton = false;
            notification.result.then(() => {
              this.getAllUsers();
            }).catch(() => {
            });
          });
      }
    }).catch(() => {
    });
  }

  // Créditer un client
  creditUserWallet(user: any, amount: number): void {
    const body = {
      id: user.id,
      wallet: amount,
      isLunchLady: true,
    };
    if (user.status === 0) {
      const modal = this.modalService.open(ConfirmationModalComponent);
      modal.componentInstance.modalTitle = `${user.name} ${user.firstname}`;
      modal.componentInstance.message = `Créditer de ${amount} euros cet utilisateur ?`;
      modal.componentInstance.twoButton = true;
      modal.result.then((confirmed) => {
        if (confirmed) {
          this.userService.creditUsersWallet(user.id, body)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
              const notification = this.modalService.open(ConfirmationModalComponent);
              notification.componentInstance.modalTitle = `${user.name} ${user.firstname}`;
              notification.componentInstance.message = `L'utilisateur a bien été crédité de ${amount} euros.`;
              notification.componentInstance.twoButton = false;
              notification.result.then(() => {
                this.getAllUsers();
              }).catch(() => {
              });
            });
        }
      }).catch(() => {
      });
    } else {
      const notification = this.modalService.open(ConfirmationModalComponent);
      notification.componentInstance.modalTitle = `${user.name} ${user.firstname}`;
      notification.componentInstance.message = 'Impossible de créditer ce compte car il est soit inactif soit supprimé.';
      notification.componentInstance.twoButton = false;
      notification.result.then().catch(() => {
      });
    }
  }
}
