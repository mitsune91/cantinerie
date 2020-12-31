import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CanteenSummaryComponent} from './canteen-summary/canteen-summary.component';
import {CanteenRoutingModule} from './canteen-routing.module';
import {AppSidebarModule} from '../../app.sidebar.module';
import {MealManagerComponent} from './meal-manager/meal-manager.component';
import {OrderManagerComponent} from './order-manager/order-manager.component';
import {UsersManagerComponent} from './users-manager/users-manager.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EditMealComponent } from './meal-manager/edit-meal/edit-meal.component';

@NgModule({
  declarations: [
    CanteenSummaryComponent,
    MealManagerComponent,
    OrderManagerComponent,
    UsersManagerComponent,
    EditMealComponent,
  ],
  imports: [
    CommonModule,
    CanteenRoutingModule,
    AppSidebarModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CanteenModule {
}
