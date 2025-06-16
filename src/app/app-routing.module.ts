import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { InicioComponent } from './components/inicio/inicio.component';
import { VentaComponent } from './components/venta/venta.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { ReportesVentasComponent } from './components/reportes-ventas/reportes-ventas.component'; // Asegúrate de importar ReportesVentasComponent


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent},
  { path: 'venta', component: VentaComponent},
  { path: 'productos', component: AdminProductosComponent},
  { path: 'reportes-ventas', component: ReportesVentasComponent }, // Asegúrate de importar ReportesVentasComponent
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // Redirige a /login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}