import { User } from './../../models/User';
import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {BaseComponent} from '../../shared/core/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseComponent implements OnInit {

  user: User;
  id = 2;

  constructor(private userService: UserService) {

    super();
  }

  ngOnInit(): void {

     // Appel au service MenuService
     this.userService.getUser(this.id)
     // Tant que la page n'est pas détruite,
     .pipe(takeUntil(this.ngUnsubscribe))
     // on souscrit à l'observable ou à la méthode getMenu()
     .subscribe(data => {
       // on stocke les données dans une variable pour les réutiliser
       this.user = data;
       console.log(this.user);
   });
  }

}
