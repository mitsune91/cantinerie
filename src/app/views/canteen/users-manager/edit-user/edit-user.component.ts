import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent } from '../../../../shared/core/base.component';
import { UserService } from '../../../../services/user.service';
import { ConfirmationModalComponent } from '../../../../components/modal/confirmation-modal/confirmation-modal.component';

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
    private userService: UserService,
    private modalService: NgbModal
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
      password: [''],
      isLunchLady: ['']
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
  editIsLunchLady(isLunchLady: boolean): void {
    this.form.value.isLunchLady = isLunchLady;
    console.log(this.form.value.isLunchLady);
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
      id: this.editedUser.id,
      name: this.form.value.name || this.editedUser.name,
      firstname: this.form.value.firstname || this.editedUser.firstname,
      sex: this.form.value.sex || this.editedUser.sex,
      address: this.form.value.address || this.editedUser.address,
      postalCode: this.form.value.postalCode || this.editedUser.postalCode,
      town: this.form.value.town || this.editedUser.town,
      email: this.form.value.email || this.editedUser.email,
      phone: this.form.value.phone || this.editedUser.phone,
      isLunchLady: this.form.value.isLunchLady || this.editedUser.isLunchLady,
      status: this.form.value.status || this.getUserStatus(this.editedUser),
      wallet: this.form.value.wallet || this.editedUser.wallet,
      password: this.form.value.password || 'bonjour' // A voir pour le password... le changement ne prend pas en compte
    };
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.modalTitle = 'Modifier un utilisateur';
    modal.componentInstance.message = 'Etes-vous sûr(e) de vouloir modifier cet utilisateur ?';
    modal.componentInstance.twoButton = true;
    modal.result.then((confirmed) => {
      if (confirmed) {
        console.log(body);
        // Si le champ cagnotte a été saisi
        // on crédite la cagnotte de l'utilisateur
        if (this.form.value.wallet) {
          this.creditUser(this.editedUser, this.form.value.wallet);
        }

        // On change ensuite le reste des informations
        this.userService.updateUser(body)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            const notification = this.modalService.open(ConfirmationModalComponent);
            notification.componentInstance.modalTitle = 'Modifier un utilisateur';
            notification.componentInstance.message = 'L\'utilisateur a bien été modifié.';
            notification.componentInstance.twoButton = false;
            notification.result.then(() => {
              this.onNavigateBack();
            }).catch(() => {
            });
          });
      }
    }).catch(() => {
    });
  }

  // Créditer utilisateur
  creditUser(user: any, amount: number): void {
    this.userService.creditUsersWallet(user.id, {
      wallet: amount
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  // TODO Ajouter update d'image + Affichage
}
