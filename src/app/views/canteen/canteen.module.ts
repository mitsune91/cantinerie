import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanteenSummaryComponent } from './canteen-summary/canteen-summary.component';
import {CanteenRoutingModule} from './canteen-routing.module';

@NgModule({
  declarations: [
    CanteenSummaryComponent
  ],
  imports: [
    CommonModule,
    CanteenRoutingModule
  ]
})
export class CanteenModule { }
