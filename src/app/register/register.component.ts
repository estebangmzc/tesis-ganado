import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class RegisterComponent implements AfterViewInit {
  email: string = '';
  password: string = '';

  @ViewChild('emailInput') emailInput!: ElementRef; // ✅ Autoenfoque en el input de email

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {}

  ngAfterViewInit() {
    setTimeout(() => this.emailInput.nativeElement.focus(), 100); // ✅ Autoenfoque al abrir modal
    this.openModal(); // ✅ Desactiva el scroll cuando se abre el modal
  }

  register() {
    this.authService.register(this.email, this.password)
      .then(() => {
        console.log('✅ Registro exitoso');
        this.closeModal();
      })
      .catch(error => {
        console.error('❌ Error al registrar:', error);
      });
  }

  openModal() {
    document.body.classList.add('modal-open'); // ✅ Bloquea el scroll de la página
  }

  closeModal() {
    document.body.classList.remove('modal-open'); // ✅ Restaura el scroll de la página
    this.dialogRef.close();
  }
}
