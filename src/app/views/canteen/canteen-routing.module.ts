import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CanteenSummaryComponent} from './canteen-summary/canteen-summary.component';
import {MealManagerComponent} from './meal-manager/meal-manager.component';
import {OrderManagerComponent} from './order-manager/order-manager.component';
import {UsersManagerComponent} from './users-manager/users-manager.component';

const routes: Routes = [
  {
    path: '',
    component: CanteenSummaryComponent
  },
  {
    path: 'meals',
    component: MealManagerComponent,
    data: {
      navigateBackRoute: 'canteen'
    }
  },
  {
    path: 'orders',
    component: OrderManagerComponent,
    data: {
      navigateBackRoute: 'canteen'
    }
  },
  {
    path: 'users',
    component: UsersManagerComponent,
    data: {
      navigateBackRoute: 'canteen'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanteenRoutingModule {
}
