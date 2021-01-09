import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmationModalComponent} from './confirmation-modal/confirmation-modal.component';



@NgModule({
  declarations: [
    ConfirmationModalComponent
  ],
  exports: [
    ConfirmationModalComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ModalsModule { }
