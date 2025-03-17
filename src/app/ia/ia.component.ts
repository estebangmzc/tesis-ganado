import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MistralService } from '../services/mistral.service'; // ✅ Importa el servicio de IA
import { Router } from '@angular/router'; // ✅ Importa Router para navegación
import { AuthService } from '../services/auth.service'; // ✅ Importa servicio de autenticación

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [MistralService],
  templateUrl: './ia.component.html',
  styleUrls: ['./ia.component.css']
})
export class IaComponent {
  userInput: string = '';
  aiResponse: string = '';
  isLoading: boolean = false;
  vistaActual = 'ia'; // ✅ Agregamos la lógica del menú
  menuOpen = false; // ✅ Estado del menú

  constructor(
    private mistralService: MistralService,
    private router: Router, // ✅ Agregamos Router
    private authService: AuthService // ✅ Agregamos AuthService
  ) {}

  async sendMessage() {
    if (!this.userInput.trim()) return;

    this.isLoading = true;
    this.aiResponse = '';

    try {
      this.aiResponse = await this.mistralService.getAIResponse(this.userInput);
    } catch (error) {
      this.aiResponse = "Error al obtener respuesta.";
    } finally {
      this.isLoading = false;
    }
  }

  // ✅ Métodos agregados para el menú y la navegación
  seleccionarVista(vista: string) {
    this.vistaActual = vista;
    this.menuOpen = false; // Cierra el menú después de seleccionar
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  irAMain() {
    this.router.navigate(['/main']); // Redirige a MainComponent
  }

  cerrarSesion() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']); // Redirige al login
    }).catch(error => {
      console.error("Error al cerrar sesión:", error);
    });
  }
}
