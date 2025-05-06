import { Component, Pipe, PipeTransform, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MistralService } from '../services/mistral.service'; // ✅ Importa el servicio de IA
import { Router } from '@angular/router'; // ✅ Importa Router para navegación
import { AuthService } from '../services/auth.service'; // ✅ Importa servicio de autenticación

// ✅ Crear el Pipe dentro del mismo archivo (si prefieres que esté todo en uno)
@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br>'); // Reemplaza saltos de línea por <br>
  }
}

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe], // Agrega SafeHtmlPipe aquí
  providers: [MistralService],
  templateUrl: './ia.component.html',
  styleUrls: ['./ia.component.css']
})
export class IaComponent {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef; // Referencia al contenedor de mensajes
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

  // ✅ Método para enviar mensaje a la IA
  async sendMessage() {
    if (!this.userInput.trim()) return;

    this.isLoading = true;
    this.aiResponse = '';

    try {
      // Llamada al servicio de IA para obtener la respuesta
      this.aiResponse = await this.mistralService.getAIResponse(this.userInput);
    } catch (error) {
      this.aiResponse = "Error al obtener respuesta.";
    } finally {
      this.isLoading = false;
      this.scrollToBottom(); // Llama a la función para desplazar el chat hacia abajo
    }
  }

  // ✅ Método para desplazar el contenedor de mensajes hacia abajo
  private scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 0);
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
