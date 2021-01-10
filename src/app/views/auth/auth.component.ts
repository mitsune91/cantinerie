import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  users: User[];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
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

  onSubmit(): any {
    this.authService.login(this.authForm.value);
  }

  getUserNotFoundSubject(): Observable<boolean> {
    return this.authService.getUserNotFoundSubject();
  }
}
