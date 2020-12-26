import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanteenSummaryComponent } from './canteen-summary/canteen-summary.component';
import {CanteenRoutingModule} from './canteen-routing.module';
import {AppSidebarModule} from '../../app.sidebar.module';
import { MealManagerComponent } from './meal-manager/meal-manager.component';
import { OrderManagerComponent } from './order-manager/order-manager.component';
import { UsersManagerComponent } from './users-manager/users-manager.component';

@NgModule({
  declarations: [
    CanteenSummaryComponent,
    MealManagerComponent,
    OrderManagerComponent,
    UsersManagerComponent,
  ],
  imports: [
    CommonModule,
    CanteenRoutingModule,
    AppSidebarModule
  ]
})
export class CanteenModule { }
