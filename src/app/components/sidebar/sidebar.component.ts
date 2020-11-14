import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  role = null;
  userMenus = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  adminManageMenus = [];

  constructor() { }

  ngOnInit(): void {
  }

}
