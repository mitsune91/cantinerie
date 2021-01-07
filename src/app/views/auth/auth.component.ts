import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from 'src/app/models/User';
import {AuthService} from 'src/app/services/auth.service';
import {UserService} from 'src/app/services/user.service';
import {isEmpty} from 'lodash-es';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  users: User[];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private usersService: UserService
  ) {
  }

  authForm: FormGroup;
  isSubmitted = false;

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  get formControls(): any {
    return this.authForm.controls;
  }

  getUsers(): User[] {
    this.usersService.getUsers();
    this.usersService.getUsers().subscribe(data => {
      this.users = data;
    });
    return this.users;
  }

  getUserByMail(mail: string): any {
    return this.getUsers()
      .filter(users => mail.indexOf(users.email) > -1)
      .filter(
        (elem1, pos, arr) =>
          arr.findIndex(elem2 => elem2.id === elem1.id) === pos
      );
  }

  onSubmit(): any {
    const formValue = this.authForm.value;
    const mail = formValue.email;
    const password = formValue.password;
    if (this.authForm.valid) {
      if (!isEmpty(this.getUserByMail(mail))) {
        const userLogged = this.getUserByMail(mail);
        if (password === 'bonjour') {
          this.authService.login(userLogged);
        }
      }
    } else {
      return this.authForm.controls;
    }
  }
}
