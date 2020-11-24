import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { User } from 'src/app/models/User'
import { AuthService } from 'src/app/services/auth.service'
import { UserService } from 'src/app/services/user.service'
import _ from 'lodash-es'
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  users: User[]
  
  constructor (
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private usersService: UserService
  ) {}
  authForm: FormGroup
  isSubmitted: boolean = false

  ngOnInit (): void {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.getUsers()
  }
  get formControls () {
    return this.authForm.controls
  }
  signIn () {
    this.isSubmitted = true
    if (this.authForm.invalid) {
      return
    }
    this.authService.signIn(this.authForm.value)
    this.router.navigateByUrl('/')
  }
  getUsers (): User[] {
    this.usersService.getUsers()
    this.usersService.getUsers().subscribe(data => {
      this.users = data
    })
    return this.users
  }
  getUserByMail (mail: string) {
    return this.getUsers()
      .filter(users => mail.indexOf(users.email) > -1)
      .filter(
        (elem1, pos, arr) =>
          arr.findIndex(elem2 => elem2.id === elem1.id) === pos
      )
  }
  onSubmit () {
    const formValue = this.authForm.value
    const mail = formValue['email']
    const password = formValue['password']
    if (!_.isEmpty(this.getUserByMail(mail))) {
      let user = this.getUserByMail(mail)
      if (password === 'bonjour') {
        this.signIn()
      }
    }
  }
}
