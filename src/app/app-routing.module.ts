
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './views/user/user.component';
import { CardComponent } from './views/card/card.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { AuthComponent } from './views/auth/auth.component';
import { HomeComponent } from './views/home/home.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {

    path: 'home/:id',
    component: UserComponent
  },
  {
    path: 'basket/:idMenu',
    component: CardComponent
  },
{
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'reset_password',
    component: ResetPasswordComponent
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
