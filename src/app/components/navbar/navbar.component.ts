import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.loggedIn;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  onBasket(): void {
    this.router.navigate(['basket']);
  }
}
