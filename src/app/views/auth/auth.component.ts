import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from 'src/app/models/User';
import {AuthService} from 'src/app/services/auth.service';
import {UserService} from 'src/app/services/user.service';
import {isEmpty} from 'lodash-es';
import {filter, map, tap} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  users: User[];
  userNotFound = false;

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

  getUserByMail(email: string): Observable<any> {
    return this.usersService.getUsers()
      .pipe(map(users => users.find(u => u.email === email)));
  }

  onSubmit(): any {
    this.userNotFound = false;
    const formValue = this.authForm.value;
    this.getUserByMail(formValue.email).subscribe(user => {
      console.log(user);
      if (!!user) {
        this.authService.login(user);
      } else {
        this.userNotFound = true;
      }
    });
  }
}
