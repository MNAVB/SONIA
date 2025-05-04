// angular import
import { Component, inject, input, output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

// project import
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

// icon
import { IconService, IconDirective } from '@ant-design/icons-angular';
import {
  LogoutOutline,
  EditOutline,
  UserOutline
} from '@ant-design/icons-angular/icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-nav-right',
  imports: [IconDirective, RouterModule, NgScrollbarModule, NgbDropdownModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  private iconService = inject(IconService);
  private router = inject(Router);
  private authService = inject(AuthService);

  styleSelectorToggle = input<boolean>();
  Customize = output();
  windowWidth: number;
  screenFull: boolean = true;
  username: string = 'MNAVB'; // Nombre de usuario predeterminado

  constructor() {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        LogoutOutline,
        UserOutline,
        EditOutline
      ]
    );
  }

  // Método para cambiar nombre de usuario
  changeUsername(): void {
    const newUsername = prompt('Ingrese nuevo nombre de usuario:', this.username);
    if (newUsername && newUsername.trim() !== '') {
      this.username = newUsername.trim();
      // En una aplicación real, aquí guardaríamos el nombre en la base de datos
    }
  }

  // Método para cerrar sesión
  logout(): void {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
      // Cerrar sesión y redirigir al login
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
