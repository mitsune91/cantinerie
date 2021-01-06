import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {HOST} from '../../../../../config/app.config';

import {BaseComponent} from '../../../shared/core/base.component';
import {UserService} from '../../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.scss']
})
export class ProfileManagerComponent extends BaseComponent implements OnInit {

  user: User;
  userPathImg: string;
  isFormDisplayed = false;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private profileForm: FormBuilder
  ) {
    super();
  }

  //   this.form = this.profileForm.group({
  //   id: [''],
  //   address: [''],
  //   wallet: [''],
  //   postalCode: [''],
  //   registrationDate: [''],
  //   email: [''],
  //   name: [''],
  //   firstname: [''],
  //   phone: [''],
  //   town: [''],
  //   sex: [''], // The sex of the user. 0 for man, 1 for woman, 2 for other
  //   status: [''], // The status for the user. 0 for Enabled, 1 for Disabled, 2 for Deleted
  //   imageId: [''],// Nullable

  // });

  ngOnInit(): void {

    let userIdConnected = JSON.parse(this.authService.getToken());

    this.getUserConnect(14); // l'dentifiant let userIdConnected
  }
  getUserConnect(id: number) {
    this.userService.getUserById(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(data => {
      this.user = data;
      this.getUserPathImgById(this.user.id)
      console.log(this.user);
    });
  }
    // Récupère le path image d'un utilisateur
    getUserPathImgById(id: number): void {
      this.userService.getImgUser(id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(data => {
          const apiUrl = HOST.apiUrl;
          this.userPathImg = apiUrl + data.imagePath.split(' ').join('%20');
        });
    }
  onEditUser(id: number) {}

      // Permet d'afficher le formulaire permettant de modifier un plat
  displayForm(): void {
    this.isFormDisplayed = !this.isFormDisplayed;
  }
      // Permet de revenir à la page de gestion des plats
  onNavigateBack(): void {
    this.router.navigate(['profile']);
  }

}





