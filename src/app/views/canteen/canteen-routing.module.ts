import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CanteenSummaryComponent} from './canteen-summary/canteen-summary.component';

const routes: Routes = [
  {
    path: '',
    component: CanteenSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanteenRoutingModule {
}
