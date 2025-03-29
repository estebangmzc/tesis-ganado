import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent implements AfterViewInit {
  name: string = '';
  birthDate: string = '';
  phone: string = '';
  farmName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = true;

  @ViewChild('emailInput') emailInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const modal = document.querySelector('.register-container');
      if (modal) {
        modal.classList.remove('preload');
        modal.classList.add('show');
      }
    }, 50);
  }

  checkPasswords() {
    this.passwordsMatch = this.password === this.confirmPassword;
  }

  async register() {
    if (!this.name || !this.birthDate || !this.phone || !this.farmName || !this.email || !this.password || !this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (!this.passwordsMatch) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    try {
      await this.authService.register(this.email, this.password, {
        name: this.name,
        birthDate: this.birthDate,
        phone: this.phone,
        farmName: this.farmName
      });

      Swal.fire({
        icon: 'success', // Tipo de alerta
        title: 'Registro exitoso',
        text: 'Por favor, verifica tu correo antes de iniciar sesión.',
        confirmButtonText: 'Aceptar', // ✅ Cambia "OK" por "Aceptar"
        confirmButtonColor: '#28a745' // ✅ Usa el verde que mencionaste
      }).then(() => {
        this.closeModal();
      });            

      this.resetForm();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: this.getErrorMessage(error.code),
        confirmButtonColor: '#d33'
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  resetForm() {
    this.name = '';
    this.birthDate = '';
    this.phone = '';
    this.farmName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'El correo ya está registrado.',
      'auth/weak-password': 'La contraseña es muy débil.',
      'auth/invalid-email': 'El correo no es válido.',
      'auth/operation-not-allowed': 'Registro deshabilitado.',
      'auth/network-request-failed': 'Error de conexión a Internet.',
    };
    return errorMessages[errorCode] || 'Error desconocido al registrar.';
  }
}
