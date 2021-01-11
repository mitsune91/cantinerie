import { User } from './../../../models/User';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {HOST} from '../../../../../config/app.config';

import {BaseComponent} from '../../../shared/core/base.component';
import {UserService} from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../components/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.scss']
})
export class ProfileManagerComponent extends BaseComponent implements OnInit {

  profileMenus = ['Profile', 'Lists des commandes','Gestion des plats'];
  user: User;
  userPathImg: string;
  isFormDisplayed = false;
  form: FormGroup;
  passwordControl = new FormControl('', Validators.required);
  closeResult = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private profileForm: FormBuilder,
    private modalService: NgbModal
  ) {
    super();


    this.form = this.profileForm.group({
      id: [''],
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

    const userIdConnected = this.authService.getDecodedToken();
       this.getUserConnect(userIdConnected); // l'dentifiant let userIdConnected
  }
  getUserConnect(token: any): void {
    const id = token.user.id
    this.userService.getUserById(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(data => {
      this.user = data;
      this.getUserPathImgById(this.user.id);
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
  // onEditUser(id: number) {}

  // Permet d'afficher le formulaire permettant de modifier un plat
  displayForm(): void {
    this.isFormDisplayed = !this.isFormDisplayed;
  }
  // Permet de revenir à la page d'accueil
  onNavigateBack(): void {
    this.router.navigate(['']);
  }
  // Naviguer entre les différents menus
  onSelectedMenu(section: string): void {
    switch (section) {
      case 'Profile':
        this.router.navigate(['profile']);
        break;
      case 'Lists des commandes':
        this.router.navigate(['profile/history']);
        break;
    }
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
      status: this.getUserStatus(this.user),
      wallet: user.wallet,
      password: pwd// A voir pour le password...
    };

    if (user) {
      const modal = this.modalService.open(ConfirmationModalComponent);
      modal.componentInstance.modalTitle = `Modifier un utilisateur ${this.user.name} ${this.user.firstname}`;
      modal.componentInstance.message = `Nouveau mot de passe de ${pwd} `;
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





