import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../../register/register.component';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; 
  successMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  async login() {
    this.clearMessages();

    if (!this.isValidEmail(this.email)) {
      this.setErrorMessage('Por favor, ingresa un correo válido.');
      return;
    }

    if (!this.password) {
      this.setErrorMessage('La contraseña no puede estar vacía.');
      return;
    }

    try {
      const user: User | null = await this.authService.login(this.email, this.password);

      if (user) {
        if (!user.emailVerified) {
          this.setErrorMessage('Debes verificar tu correo antes de iniciar sesión.');
          return;
        }

        this.setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');
        setTimeout(() => this.router.navigate(['/main']), 2000);
      }
    } catch (error: any) {
      console.error("Error completo:", error);
      this.setErrorMessage(error.message); // ✅ Ahora solo muestra el mensaje de error correctamente
    }
  }

  async loginWithGoogle() {
    this.clearMessages();

    try {
      await this.authService.loginWithGoogle();
      this.setSuccessMessage('Inicio de sesión con Google exitoso. Redirigiendo...');
      setTimeout(() => this.router.navigate(['/main']), 2000);
    } catch (error: any) {
      console.error("Error completo:", error);
      this.setErrorMessage(error.message);
    }
  }

  openRegister() {
    this.dialog.open(RegisterComponent, { width: '400px' });
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  private setErrorMessage(message: string) {
    this.errorMessage = message;
    this.cd.markForCheck();
    setTimeout(() => {
      this.errorMessage = '';
      this.cd.markForCheck();
    }, 5000);
  }

  private setSuccessMessage(message: string) {
    this.successMessage = message;
    this.cd.markForCheck();
    setTimeout(() => {
      this.successMessage = '';
      this.cd.markForCheck();
    }, 5000);
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
    this.cd.markForCheck();
  }
}

