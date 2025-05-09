import { Component, Pipe, PipeTransform, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MistralService } from '../services/mistral.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br>');
  }
}

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  providers: [MistralService],
  templateUrl: './ia.component.html',
  styleUrls: ['./ia.component.css']
})
export class IaComponent {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  userInput: string = '';
  aiResponse: string = '';
  isLoading: boolean = false;
  vistaActual = 'ia';
  menuOpen = false;

  constructor(
    private mistralService: MistralService,
    private router: Router,
    private authService: AuthService
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
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

  seleccionarVista(vista: string) {
    this.vistaActual = vista;
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  irAMain() {
    this.router.navigate(['/main']);
  }

  cerrarSesion() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error("Error al cerrar sesión:", error);
    });
  }
}
