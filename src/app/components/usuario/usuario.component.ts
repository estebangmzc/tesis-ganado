import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  imports: [CommonModule, RouterModule, EditarPerfilComponent] // ✅ Se importa el componente de edición
})
export class UsuarioComponent implements OnInit, OnDestroy {
  user: User | null = null;
  userData: UserData | null = null;
  loading: boolean = true;
  mostrarModal: boolean = false; // ✅ Control del modal

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

  // ✅ Métodos para abrir y cerrar el modal de edición
  openEditProfile() {
    this.mostrarModal = true;
  }

  closeEditProfile() {
    this.mostrarModal = false;
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
