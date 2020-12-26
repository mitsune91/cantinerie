import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SidebarComponent} from './components/sidebar/sidebar.component';

const sidebarComponents = [
  SidebarComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [...sidebarComponents],
  exports: [...sidebarComponents],
})
export class AppSidebarModule { }
