import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule, RouterModule, FontAwesomeModule, MatTooltipModule],
})
export class MenuComponent {
  faUserCircle = faUserCircle;
  faCog = faCog;

  // Propiedad que maneja si el menú está abierto o cerrado
  menuOpen: boolean = false;

  constructor(private router: Router) {}

  // Método para alternar el estado del menú
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;  // Cambiar el estado del menú
  }

  irAInventario() {
    this.router.navigate(['/main']);
  }

  irAEstadisticas() {
    this.router.navigate(['/estadisticas']);
  }

  irAIa() {
    this.router.navigate(['/ia']);
  }

  irABiblioteca() {
    this.router.navigate(['/biblioteca']);
  }

  irAUsuario() {
    this.router.navigate(['/usuario']);
  }

  irATerminos() {
    this.router.navigate(['/terminos']);
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  estaEnRuta(ruta: string): boolean {
    return this.router.url === ruta;
  }
}
