import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();

  role = null;
  userMenus = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  adminManageMenus = [];

  constructor() { }

  ngOnInit(): void {
  }

  // Récupère le jour sélectionner dans la sidebar
  // pour l'envoyer au composant Home
  selectDayForMenu(value: string): void {
    this.newItemEvent.emit(value);
  }

}
