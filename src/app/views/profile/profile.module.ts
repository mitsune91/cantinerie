import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileManagerComponent } from './profile-manager/profile-manager.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileOrderComponent } from './profile-order/profile-order.component';

@NgModule({
  declarations: [
  ProfileManagerComponent,
  ProfileOrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule {
}
