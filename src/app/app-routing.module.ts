import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ResetPasswordComponent } from './views/reset-password/reset-password.component'
import { AuthComponent } from './views/auth/auth.component'
import { HomeComponent } from './views/home/home.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
