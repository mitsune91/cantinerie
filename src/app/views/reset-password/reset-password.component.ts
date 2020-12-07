import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { isEmpty } from 'lodash-es'
import { stringify } from 'querystring'
import { User } from 'src/app/models/User'
import { ForgottenPasswordService } from 'src/app/services/forgotten-password.service'
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  users: User[]
  constructor (
    private formBuilder: FormBuilder,
    private passwordService: ForgottenPasswordService,
    private router: Router
  ) {}
  resetForm: FormGroup
  isSubmitted: boolean = false
  ngOnInit (): void {
    this.resetForm = this.formBuilder.group({
      email: ['', Validators.required]
    })
  }

  onSubmit () {
    const formValue = this.resetForm.value
    const mail = formValue['email']
    if (this.resetForm.valid) {
      console.log(mail)
      this.passwordService
        .sendMailForPassword(mail)
        .then(() => {
          this.router.navigate(['/login'])
        })
        .catch(err => {
          console.log('err : ', err)
        })
    } else {
      alert('Veuillez remplir tout les champs ! ')
    }
  }
}
