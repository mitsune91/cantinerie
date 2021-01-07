import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEmpty } from 'lodash-es';
import { stringify } from 'querystring';
import { User } from 'src/app/models/User';
import { ForgottenPasswordService } from 'src/app/services/forgotten-password.service';
import { UserService } from 'src/app/services/user.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  users: User[];
  user: User;
  isFormDisplayed = false;
  //isFormDisplayedheader = false;

  constructor (
    private formBuilder: FormBuilder,
    private passwordService: ForgottenPasswordService,
    private router: Router,
    private usersService: UserService
  ) {
  }
  resetForm: FormGroup;
  passwordFrom: FormGroup;


  isSubmitted: boolean = false;
  ngOnInit (): void {
    this.resetForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
    this.passwordFrom = this.formBuilder.group({
      password: [''],
      confirmpassword: ['']
    });

  }

  // Permet d'afficher le formulaire permettant de modifier un plat
  displayForm(): void {
    this.isFormDisplayed = !this.isFormDisplayed;
  }


  getUserByMail (mail: string): any {
    this.usersService.getUsers()
    .subscribe(data => {
      this.users = data
      const user = this.users
      .filter(users => mail.indexOf(users.email) > -1)
      .filter(
        (elem1, pos, arr) =>
          arr.findIndex(elem2 => elem2.id === elem1.id) === pos
      )
      console.log(user[0]);
      this.setNewPwd(user[0]);
      return user[0];
    });
  }

  /**
   *
   * @param [user] l'utilisateur drouver par le mail
   */
  setNewPwd(user: User){
    console.log(user);

    /**
     * Le nouveau mot de passe dan le formulaire
     */
    let pwd = this.getPwd();

    const body = {
      // isLunchLady: true, // Décommenter pour tester la requête
      id: user.id,
      name: user.name,
      firstname:  user.firstname,
      sex: user.sex,
      address: user.address,
      postalCode: user.postalCode,
      town: user.town,
      email: user.email,
      phone:  user.phone,
      status:  user.status,
      wallet:  user.wallet,
      password: pwd
    };
    this.usersService.updateUser(body)
        .subscribe();
  }

  getPwd(){
    console.log(this.passwordFrom.value.password);
    console.log(this.passwordFrom.value.confirmpassword);
    return this.passwordFrom.value.password;
  }
  /**
   * Active toute les fonction
   */
  submitChangePwd(){}

  onSubmit () {
    const formValue = this.resetForm.value
    const mail = formValue['email']
    if (this.resetForm.valid) {
      console.log(mail)
      this.passwordService
        .sendMailForPassword(mail)
        .then(() => {
          this.isFormDisplayed = true;
          this.submitChangePwd();
          console.log(this.getUserByMail(mail));
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
