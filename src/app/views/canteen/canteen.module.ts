import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanteenSummaryComponent } from './canteen-summary/canteen-summary.component';
import {CanteenRoutingModule} from './canteen-routing.module';
import {AppSidebarModule} from '../../app.sidebar.module';

@NgModule({
  declarations: [
    CanteenSummaryComponent,
  ],
  imports: [
    CommonModule,
    CanteenRoutingModule,
    AppSidebarModule
  ]
})
export class CanteenModule { }
