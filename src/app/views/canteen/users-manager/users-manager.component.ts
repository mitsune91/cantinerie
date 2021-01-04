import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {debounceTime, takeUntil} from 'rxjs/operators';

import {BaseComponent} from '../../../shared/core/base.component';
import {UserService} from '../../../services/user.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
  walletControl = new FormControl('');
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
        console.log(this.users);
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
          this.getFilterMealsData(users, key);
        } else {
          this.filteredUsers = this.users;
        }
      });
  }

  // Récupère des plats en fonction des lettres tapées dans le filtre
  getFilterMealsData(users: any, key: string): void {
    this.filteredUsers = users.filter(u => u.firstname.toLowerCase().includes(key) || u.name.toLowerCase().includes(key));
    console.log(this.filteredUsers);
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

  onManageUserWallet(content: any, user: any): void {
    this.editedUser = user;
    this.modalService.open( content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
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
    this.userService.deleteUserById(user.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  // Créditer un client
  creditUserWallet(user: any, amount: number): void {
    console.log(user);
    const body = {
      id: user.id,
      wallet: user.wallet + amount,
      isLunchLady: true,
    };
    console.log(body);
    this.userService.creditUsersWallet(user.id, body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.getAllUsers();
      });
  }

}
