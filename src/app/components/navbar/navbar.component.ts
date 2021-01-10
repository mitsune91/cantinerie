import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from "rxjs/operators";

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../services/user.service';
import { BaseComponent } from '../../shared/core/base.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends BaseComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  wallet: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.loggedIn;
    if (this.isLoggedIn()) {
      this.wallet = this.getUserWallet();
    }
  }

  // Permet de se déconnecter et renvoie vers la home
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Naviguer vers le panier
  onBasket(): void {
    this.router.navigate(['profile/:id']);
  }

  // Vérifie si un utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  // Permet de savoir si l'utilisateur connecté est un user lambda
  isUser(): boolean {
    return this.getRole() === 'ROLE_USER';
  }

  // Naviguer vers la home user ou canteen
  onNavigateHome(): string {
    return this.getRole() === 'ROLE_LUNCHLADY' ? '/canteen' : '/';
  }

  // Récupère la cagnotte d'un utilisateur connecté pour l'afficher
  getUserWallet(): number {
    let connectedUser: any = {};
    this.userService.getUserById(this.getUserId())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => {
        connectedUser = user;
      });
    return connectedUser.wallet;
  }

  // Récupère l'id d'un utilisateur
  getUserId(): number {
    return this.getDecodedToken().user.id;
  }

  // Récupérer le rôle de l'utilisateur connecté
  getRole(): string {
    return this.authService.getRole();
  }

  // Décode le token pour récupérer des infos
  // de l'utilisateur connecté
  getDecodedToken(): any {
    return this.authService.getDecodedToken();
  }
}
