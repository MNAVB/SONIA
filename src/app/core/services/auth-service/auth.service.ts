import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Método para iniciar sesión (acepta cualquier credencial)
  login(email: string, password: string): boolean {
    // Simulamos un login exitoso con cualquier credencial
    const user = {
      email: email,
      name: 'MNAVB',
      role: 'user'
    };

    // Guardar en localStorage para mantener la sesión
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // Comprobar si el usuario está autenticado
  isAuthenticated(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }
}
