import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // ✅ Corrige la ruta de importación

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf]
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  message: string = '';        
  errorMessage: string = '';    
  loading: boolean = false;    

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // ✅ Ahora se inyecta correctamente
    private dialogRef: MatDialogRef<PasswordResetComponent>
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.resetForm.value.email;

    // Verifica si el correo existe antes de enviar el reset
    this.authService.checkIfEmailExists(email)
      .then((exists) => {
        if (!exists) {
          this.errorMessage = 'No hay una cuenta registrada con este correo.';
          this.message = '';
          this.loading = false;
          return;
        }

        // Si el correo existe, envía el correo de recuperación
        this.authService.resetPassword(email)
          .then(() => {
            this.message = 'Se ha enviado un correo para restablecer la contraseña.';
            this.errorMessage = '';
          })
          .catch((error: any) => {
            this.errorMessage = this.getErrorMessage(error.code);
            this.message = '';
          })
          .finally(() => {
            this.loading = false;
          });
      })
      .catch(() => {
        this.errorMessage = 'Hubo un error al verificar el correo.';
        this.message = '';
        this.loading = false;
      });
  }

  closeModal() {
    this.dialogRef.close();
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No hay una cuenta registrada con este correo.',
      'auth/invalid-email': 'El correo ingresado no es válido.',
      'auth/too-many-requests': 'Has hecho demasiadas solicitudes. Intenta más tarde.',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
      'default': 'Hubo un error al enviar el correo. Inténtalo de nuevo.'
    };
    return errorMessages[errorCode] || errorMessages['default'];
  }
}
