import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './views/user/user.component';
import { CardComponent } from './views/card/card.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { AuthComponent } from './views/auth/auth.component';
import { HomeComponent } from './views/home/home.component';
import {AddUserComponent} from './views/canteen/users-manager/add-user/add-user.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import {IsNotLoggedGuard} from './guards/is-not-logged.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'canteen',
    loadChildren: () => import('./views/canteen/canteen.module').then(m => m.CanteenModule),
    canActivate: [AuthGuard, RoleGuard],
    data: {
      authorizedRole: ['ROLE_LUNCHLADY']
    }
  },
  {
    path: 'profile',
    loadChildren: () => import('./views/profile/profile.module').then(p => p.ProfileModule),
    canActivate: [AuthGuard, RoleGuard],
    data: {
      authorizedRole: ['ROLE_USER']
    }
  },
  {
    path: 'panier/:idMenu',
    component: CardComponent,
  },
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [IsNotLoggedGuard]
  },
  {
    path: 'reset_password',
    component: ResetPasswordComponent,
    canActivate: [IsNotLoggedGuard]
  },
  {
    path: 'signin',
    component: AddUserComponent,
    canActivate: [IsNotLoggedGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
