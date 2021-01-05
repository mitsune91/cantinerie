import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() buttonsMenu;

  @Output() btnEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  // Récupère le jour sélectionner dans la sidebar
  // pour l'envoyer au composant Home
  selectDayForMenu(value: string): void {
    this.btnEvent.emit(value);
  }


}
