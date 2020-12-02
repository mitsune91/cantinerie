import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../services/menu.service';
import {takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../shared/core/base.component';
import {Menu} from '../../models/Menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  menus: Array<Menu> = [];

  constructor(private menuService: MenuService,
              private route: Router) {
    super();
  }

  ngOnInit(): void {
    // Exemple d'appel api
    // Ici je récupère tous les menus

    // Appel au service MenuService
    this.menuService.getMenus()
      // Tant que la page n'est pas détruite,
      .pipe(takeUntil(this.ngUnsubscribe))
      // on souscrit à l'observable ou à la méthode getMenu()
      .subscribe(data => {
        // on stocke les données dans une variable pour les réutiliser
        this.menus = data;
        //console.log(this.menus);
    });
  }

  // selectMenu(idUser: number = 1, id: number) {
  //   console.log(id);
  //   if (idUser) {
  //     this.route.navigate(['home/', idUser, '/basket/', id]);
  //   } else {
  //     this.route.navigate(['/404']);
  //     alert('connecté vous!');
  //   }
  // }
  selectMenu(id: number) {
    console.log(id);
    if (id) {
      this.route.navigate(['/basket/', id]);
    } else {
      this.route.navigate(['/404']);
      alert('panier vide!');
    }
  }


}
