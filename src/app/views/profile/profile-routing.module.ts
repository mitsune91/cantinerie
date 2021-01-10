import { ProfileManagerComponent } from './profile-manager/profile-manager.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileOrderComponent } from './profile-order/profile-order.component';


const routes: Routes = [
  {
    path: '',
    component: ProfileManagerComponent
  },
  {
    path: 'history',
    component: ProfileOrderComponent,
    data: {
      navigateBackRoute: 'profile'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}
