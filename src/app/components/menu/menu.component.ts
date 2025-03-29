import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // ✅ Importa FontAwesome
import { faUserCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [FontAwesomeModule, MatTooltipModule], // ✅ Agrega FontAwesome aquí
})
export class MenuComponent {
  faUserCircle = faUserCircle;
  faCog = faCog;

  constructor(private router: Router) {}

  irAInventario() {
    this.router.navigate(['/main']);
  }

  irAIa() {
    this.router.navigate(['/ia']);
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
}
