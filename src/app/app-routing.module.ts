import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { InicioComponent } from './components/inicio/inicio.component';
import { CrearclienteComponent } from './components/crearcliente/crearcliente.component';
import { VentaComponent } from './components/venta/venta.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { UsuarioComponent } from './components/usuario/usuario.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent},
  { path: 'crearcliente', component: CrearclienteComponent},
  { path: 'venta', component: VentaComponent},
  { path: 'productos', component: AdminProductosComponent},
  { path: 'usuario', component: UsuarioComponent},
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // Redirige a /login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}