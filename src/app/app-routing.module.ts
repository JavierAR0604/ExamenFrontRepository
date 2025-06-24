import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login/pages/login-page/login-page.component';
import { MainPageComponent } from './modules/main/pages/main-page/main-page.component';
import { EmpleadosPageComponent } from './modules/empleados/pages/empleados-page/empleados-page.component';
import { PuestosPageComponent } from './modules/puestos/pages/puestos-page/puestos-page.component';
import { TareasPageComponent } from './modules/tareas/pages/tareas-page/tareas-page.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'dashboard',
    component: MainPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'empleados',
    component: EmpleadosPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'puestos',
    component: PuestosPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tareas',
    component: TareasPageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
