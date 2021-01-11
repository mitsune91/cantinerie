import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEmpty } from 'lodash-es';
import { stringify } from 'querystring';
import { User } from 'src/app/models/User';
import { ForgottenPasswordService } from 'src/app/services/forgotten-password.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../../shared/core/base.component';

import {debounceTime, map, takeUntil} from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../components/modal/confirmation-modal/confirmation-modal.component';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {

  users: User[];
  user: User;
  closeResult = '';

  passwordControl = new FormControl('', Validators.required);
  constructor (
    private formBuilder: FormBuilder,
    private passwordService: ForgottenPasswordService,
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal
  ) {
    super();
  }
  resetForm: FormGroup;
  isSubmitted: boolean = false;
  ngOnInit (): void {
    this.resetForm = this.formBuilder.group({
      email: ['', Validators.required]
    })
  }
  changePwd(user: User, pwd: any): void {
    console.log('click')
    const body = {
      // isLunchLady: true, // Décommenter pour tester la requête
      id: user.id,
      name: user.name,
      firstname: user.firstname,
      sex: user.sex,
      address: user.address,
      postalCode: user.postalCode,
      town: user.town,
      email: user.email,
      phone: user.phone,
      status: user.status,
      wallet: user.wallet,
      password: pwd// A voir pour le password...
    };

    if (user) {
      const modal = this.modalService.open(ConfirmationModalComponent);
      modal.componentInstance.modalTitle = `Modifier un utilisateur ${this.user.name} ${this.user.firstname}`;
      modal.componentInstance.message = `Nouveau mot de passe est ${pwd} `;
      modal.componentInstance.twoButton = true;
      modal.result.then((confirmed) => {
        console.log(body)
        if (confirmed) {
          this.userService.updateUser(body)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          const notification = this.modalService.open(ConfirmationModalComponent);
            notification.componentInstance.modalTitle = `Modifier un utilisateur ${this.user.name} ${this.user.firstname}`;
            notification.componentInstance.message = `Le mot de passe a bien été modifié`;
            notification.componentInstance.twoButton = false;
            notification.result.then(() => {
              this.router.navigate(['profile']);
            }).catch(() => {
            });
        });
        }
      }).catch(() => {
      });
    } else {
      const notification = this.modalService.open(ConfirmationModalComponent);
      notification.componentInstance.modalTitle = 'Modifier un utilisateur';
      notification.componentInstance.message = `Impossible de changer le mot de passe de l'utilisateur ${this.user.name} ${this.user.firstname}`;
      notification.componentInstance.twoButton = false;
      notification.result.then().catch(() => {
      });
    }
  }
  onManageUserPassword(content: any, user: any): void {
    this.user = user;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
      this.changePwd(user, this.passwordControl.value);
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
  // getUserByMail (mail: string): any {
  //   this.userService.getUsers()
  //   .subscribe(data => {
  //     this.users = data
  //     const user = this.users
  //     .filter(users => mail.indexOf(users.email) > -1)
  //     .filter(
  //       (elem1, pos, arr) =>
  //         arr.findIndex(elem2 => elem2.id === elem1.id) === pos
  //     )
  //     console.log(user[0]);
  //     this.user = user[0];
  //   });
  // }
  getUserByMail(email: string): Observable<any> {
    return this.userService.getUsers()
      .pipe(map(users => users.find(u => u.email === email)));
  }
  onSubmit (content) {
    const formValue = this.resetForm.value
    const mail = formValue['email']
    if (this.resetForm.valid) {
      console.log(mail)
      this.passwordService
        .sendMailForPassword(mail)
        .then(() => {
          const user = this.getUserByMail(mail)
          console.log(this.user);
          this.onManageUserPassword(content, user)
          //this.router.navigate(['/login']);
        })
        .catch(err => {
          console.log('err : ', err);
        })
    } else {
      alert('Veuillez remplir tout les champs ! ');
    }
  }
}
