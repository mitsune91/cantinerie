import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
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
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private profileForm: FormBuilder
  ) {
    super();


    this.form = this.profileForm.group({
      name: [''],
      firstname: [''],
      sex: [''],
      address: [''],
      postalCode: [''],
      town: [''],
      email: [''],
      phone: [''],
      wallet: [''],
      password: ['']
    });
  }



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
  // Récupère le status de la commande
  getUserSex(user: any): string {
    let sex = '';
    this.userService.sex.forEach(u => {
      if (u.code === user.sex) {
        sex = u.label;
      }
    });
    return sex;
  }

  // Modifie le status via le formulaire
  editUserStatus(status: any): void {
    this.form.value.status = status;
    console.log(this.form.value.status);
  }


  // Récupère le status de la commande
  getUserStatus(user: any): string {
    let status = '';
    this.userService.status.forEach(s => {
      if (s.code === user.status) {
        status = s.label;
      }
    });
    return status;
  }
  onEditUser(id: number) {}

  // Permet d'afficher le formulaire permettant de modifier un plat
  displayForm(): void {
    this.isFormDisplayed = !this.isFormDisplayed;
  }
  // Permet de revenir à la page d'accueil
  onNavigateBack(): void {
    this.router.navigate(['']);
  }

  // Envoie les changements du formulaire
    submitEditedUser(): void {
      const body = {
        // isLunchLady: true, // Décommenter pour tester la requête
        id: this.user.id,
        name: this.form.value.name || this.user.name,
        firstname: this.form.value.firstname || this.user.firstname,
        sex: this.form.value.sex || this.user.sex,
        address: this.form.value.address || this.user.address,
        postalCode: this.form.value.postalCode || this.user.postalCode,
        town: this.form.value.town || this.user.town,
        email: this.form.value.email || this.user.email,
        phone: this.form.value.phone || this.user.phone,
        status: this.form.value.status || this.getUserStatus(this.user),
        wallet: this.form.value.wallet || this.user.wallet,
        password: this.form.value.password || 'bonjour' // A voir pour le password...
      };
      this.userService.updateUser(body)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe();
    }

}





