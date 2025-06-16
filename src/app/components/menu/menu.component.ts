import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
 constructor(public authService: LoginService) {}
  userPermiso: number = 0;
  username: string = '';


  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.userPermiso = this.authService.getPermiso();
      this.username = this.authService.getUsername() || '';
    });
  }

  get showVendedorRoutes(): boolean {
    return this.userPermiso >= 1; // Vendedor y Admin
  }

  get showAdminRoutes(): boolean {
    return this.userPermiso === 2; // Solo Admin
  }
}
