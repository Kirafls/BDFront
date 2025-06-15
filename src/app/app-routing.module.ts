import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent},
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // Redirige a /login
  { path: 'usuario', loadComponent: () => import('./components/usuario/usuario.component').then(c => c.UsuarioComponent)}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}