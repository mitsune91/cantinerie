import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent } from '../../../../shared/core/base.component';
import { UserService } from '../../../../services/user.service';
import { ROLE_NAME } from '../../../../services/auth.service';
import { ConfirmationModalComponent } from '../../../../components/modal/confirmation-modal/confirmation-modal.component';

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
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super();

    this.form = this.fb.group({
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      sex: [''],
      address: [''],
      postalCode: [''],
      town: [''],
      email: ['', Validators.required],
      phone: [''],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  // Permet de revenir à la page de gestion des commandes ou home user
  onNavigateBack(): void {
    const role = localStorage.getItem(ROLE_NAME);
    if (role === 'ROLE_LUNCHLADY') {
      this.router.navigate(['canteen/users']);
    } else {
      this.router.navigate(['/']);
    }
  }

  // Envoie les changements du formulaire
  submitEditedUser(): void {
    const body = this.form.value;
    const modal = this.modalService.open(ConfirmationModalComponent);
    modal.componentInstance.modalTitle = 'Enregistrement';
    modal.componentInstance.message = 'Etes-vous sûr(e) de vouloir valider cet enregistrement ?';
    modal.componentInstance.twoButton = true;
    modal.result.then((confirmed) => {
      if (confirmed) {
        this.userService.putUser(body)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            const notification = this.modalService.open(ConfirmationModalComponent);
            notification.componentInstance.modalTitle = 'Enregistrement';
            notification.componentInstance.message = 'Le compte a bien été ajouté.';
            notification.componentInstance.twoButton = false;
            notification.result.then(() => {
              this.onNavigateBack();
            }).catch(() => {});
          });
      }
    }).catch(() => {});
  }

}
