import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(private router: Router) {}

  irAInventario() {
    this.router.navigate(['/main']); // Ajusta la ruta si es diferente
  }

  irAIa() {
    this.router.navigate(['/ia']); // Ajusta la ruta si es diferente
  }

  cerrarSesion() {
    // Aquí puedes manejar la lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}
