import { User } from '../../../models/User';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/order.service';
import { BaseComponent } from '../../../shared/core/base.component';

import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile-order',
  templateUrl: './profile-order.component.html',
  styleUrls: ['./profile-order.component.scss']
})
export class ProfileOrderComponent extends BaseComponent implements OnInit {

  user: User
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private orderService: OrderService) {
      super();
    }

  ngOnInit(): void {

    const userIdConnected = this.authService.getDecodedToken();
    this.getUserConnect(userIdConnected); // l'dentifiant let userIdConnected

    // this.getOrdersOfuser(idUser);
}
  // getOrdersOfuser(id: number) {
  //   let params = {
  //     status: 1, // satus delivery
  //     beginDate: '2020-07-12', //date depuis
  //     endDate: '2021-01-10' // date du jour
  //   }

  //   this.orderService.getOrdersByUserAndByCriteria(id,params)
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(data => {
  //       console.log(data)
  //     });
  // }
  getUserConnect(token: any): void {
    const id = token.user.id
    this.userService.getUserById(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(data => {
      this.user = data;

      //this.getOrdersOfuser(this.user.id)

    });
  }

}
