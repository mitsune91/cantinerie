import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../services/menu.service';
import {takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../shared/core/base.component';
import {Menu} from '../../models/Menu';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  menus: Array<Menu> = [];

  constructor(private menuService: MenuService) {
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
        console.log(this.menus);
    });
  }

}
