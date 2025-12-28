import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { InicioComponent } from './components/inicio/inicio.component';
import { CrearclienteComponent } from './components/crearcliente/crearcliente.component';
import { VentaComponent } from './components/venta/venta.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { SobreNosotros } from './components/sobrenosotros/sobrenosotros';

const routes: Routes = [
// Rutas públicas (accesibles para todos)
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'crearcliente', component: CrearclienteComponent },
  { path: 'venta', component: VentaComponent },
  { path: 'productos', component: AdminProductosComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'reporte', component: ReporteComponent },
 { path: 'sobre', component: SobreNosotros }
  { path: '**', redirectTo: '/inicio' } // Ruta comodín
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
