import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login/pages/login-page/login-page.component';
import { MainPageComponent } from './modules/main/pages/main-page/main-page.component';
import { EmpleadosPageComponent } from './modules/empleados/pages/empleados-page/empleados-page.component';
import { PuestosPageComponent } from './modules/puestos/pages/puestos-page/puestos-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: MainPageComponent,
  },
  {
    path: 'empleados',
    component: EmpleadosPageComponent,
  },
    {
    path: 'puestos',
    component: PuestosPageComponent,
  },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
