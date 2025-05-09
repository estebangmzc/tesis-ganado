import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../../register/register.component';
import { PasswordResetComponent } from '../password-reset/password-reset.component';
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
      const user = await this.authService.login(this.email, this.password);
  
      if (user) {
        if (!user.emailVerified) {
          this.setErrorMessage('Tu correo no está verificado. Hemos enviado un nuevo correo de verificación.');
          await this.authService.sendVerificationEmail(user);
          return;
        }        
  
        this.setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');
        setTimeout(() => this.router.navigate(['/main']), 2000);
      }
    } catch (error: any) {
      console.error("Error en el login:", error);
      if (error.code === 'auth/user-not-found') {
        this.setErrorMessage('No se encontró una cuenta con este correo.');
      } else if (error.code === 'auth/wrong-password') {
        this.setErrorMessage('La contraseña es incorrecta.');
      } else {
        this.setErrorMessage(error.message);
      }
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

  openResetPasswordModal() {
    this.dialog.open(PasswordResetComponent, {
      width: '400px',
      disableClose: true
    });
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
