import { Component, OnInit } from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../../../shared/core/base.component';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent extends BaseComponent implements OnInit {

  userId: number;
  editedUser: any = {};
  isFormDisplayed = false;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
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
      password: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: any) => {
        const id = params.get('id');
        this.userId = Number(id); // Cast string into number
        this.getUserById(this.userId);
      });
  }

  // Récupère un commande grâce à son id
  getUserById(id: number): void {
    this.userService.getUserById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => {
        this.editedUser = user;
        console.log(this.editedUser);
        this.getUserStatus(this.editedUser);
      });
  }

  // Permet d'afficher le formulaire permettant de modifier un plat
  displayForm(): void {
    this.isFormDisplayed = !this.isFormDisplayed;
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

  // Envoie les changements du formulaire
  submitEditedUser(): void {
    const body = {
      // isLunchLady: true, // Décommenter pour tester la requête
      id: this.editedUser.id,
      name: this.form.value.name || this.editedUser.name,
      firstname: this.form.value.firstname || this.editedUser.firstname,
      sex: this.form.value.sex || this.editedUser.sex,
      address: this.form.value.address || this.editedUser.address,
      postalCode: this.form.value.postalCode || this.editedUser.postalCode,
      town: this.form.value.town || this.editedUser.town,
      email: this.form.value.email || this.editedUser.email,
      phone: this.form.value.phone || this.editedUser.phone,
      status: this.form.value.status || this.getUserStatus(this.editedUser),
      wallet: this.form.value.wallet || this.editedUser.wallet,
      password: this.form.value.password || 'bonjour' // A voir pour le password...
    };
    this.userService.updateUser(body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  // TODO Ajouter update d'image + Affichage
}
