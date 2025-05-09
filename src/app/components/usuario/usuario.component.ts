import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, deleteUser, getAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  standalone: true,
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  imports: [CommonModule, RouterModule, EditarPerfilComponent, MatTooltipModule]
})
export class UsuarioComponent implements OnInit, OnDestroy {
  user: User | null = null;
  userData: UserData | null = null;
  loading: boolean = true;
  mostrarModal: boolean = false;

  private userSubscription: Subscription | null = null;
  private userDataSubscription: Subscription | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.userSubscription = this.authService.getAuthState().subscribe((user) => {
      this.user = user;
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this.userData = null;
        this.loading = false;
      }
    });
  }

  loadUserData(uid: string) {
    if (!uid) {
        this.loading = false;
        return;
    }

    this.userDataSubscription = this.authService.getUserData(uid).subscribe((data) => {
        this.userData = data ?? null;
        this.loading = false;
    });
  }

  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/login']))
      .catch(error => console.error("❌ Error al cerrar sesión:", error));
  }

  async cambiarContrasena() {
    if (this.user && this.user.email) {
      try {
        await this.authService.sendPasswordResetEmail(this.user.email);
        alert('Se ha enviado un correo para restablecer tu contraseña.');
      } catch (error) {
        console.error("❌ Error al enviar el correo de restablecimiento de contraseña:", error);
      }
    }
  }

  openEditProfile() {
    this.mostrarModal = true;
  }

  closeEditProfile() {
    this.mostrarModal = false;
  }

  confirmarEliminarCuenta() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará tu cuenta y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar cuenta",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCuenta();
      }
    });
  }

  eliminarCuenta() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      deleteUser(user)
        .then(() => {
          console.log("✅ Cuenta eliminada con éxito.");
          this.router.navigate(['/login']);
        })
        .catch(error => {
          console.error("❌ Error al eliminar la cuenta:", error.message);
          if (error.code === 'auth/requires-recent-login') {
            Swal.fire(
              'Error de seguridad',
              'Por seguridad, vuelve a iniciar sesión antes de eliminar la cuenta.',
              'error'
            );
          }
        });
    }
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.userDataSubscription?.unsubscribe();
  }
}

interface UserData {
  name: string;
  email: string;
  phone?: string;
  farmName?: string;
  birthDate?: string;
}
