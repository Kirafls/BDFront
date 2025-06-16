import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginInterceptor } from './interceptors/login.interceptor';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { VentaComponent } from './components/venta/venta.component';
import { ReportesVentasComponent } from './components/reportes-ventas/reportes-ventas.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    InicioComponent,
    VentaComponent,
    AdminProductosComponent,
    ReportesVentasComponent
  ],
  imports: [
  
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    
    
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoginInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
