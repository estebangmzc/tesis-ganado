import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf
import { RouterModule } from '@angular/router'; // Importa RouterModule para <router-outlet>
import { MenuComponent } from './components/menu/menu.component'; // Importa el menú

@Component({
  selector: 'app-root',
  standalone: true, // Componente independiente
  imports: [CommonModule, RouterModule, MenuComponent], // Asegura los módulos necesarios
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}

  esLogin(): boolean {
    return this.router.url === '/login';
  }
}
