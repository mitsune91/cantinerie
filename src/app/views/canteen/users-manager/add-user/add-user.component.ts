import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

import {BaseComponent} from '../../../../shared/core/base.component';
import {UserService} from '../../../../services/user.service';
import {TOKEN_NAME} from '../../../../services/auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent extends BaseComponent implements OnInit {

  form: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    super();

    this.form = this.fb.group({
      name: [''],
      firstname: [''],
      sex: [''],
      address: [''],
      postalCode: [''],
      town: [''],
      email: [''],
      phone: [''],
      wallet: [''],
    });
  }

  ngOnInit(): void {
    console.log(localStorage.getItem(TOKEN_NAME));
  }

  // Permet de revenir à la page de gestion des commandes
  onNavigateBack(): void {
    this.router.navigate(['canteen/users']);
  }

  // Modifie le status via le formulaire
  editUserStatus(status: any): void {
    this.form.value.status = status;
    console.log(this.form.value.status);
  }

  // Envoie les changements du formulaire
  submitEditedUser(): void {
    const body = {
      // isLunchLady: true, // Décommenter pour tester la requête
      name: this.form.value.name,
      firstname: this.form.value.firstname,
      sex: this.form.value.sex,
      address: this.form.value.address,
      postalCode: this.form.value.postalCode,
      town: this.form.value.town,
      email: this.form.value.email,
      phone: this.form.value.phone,
      status: this.form.value.status,
      wallet: this.form.value.wallet,
      password: 'bonjour' // A voir pour le password...
    };
    this.userService.putUser(body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  isLogged(): boolean {
    return (localStorage.getItem(TOKEN_NAME) !== null) ? true : false;
  }

}
