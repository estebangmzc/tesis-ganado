import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { MainComponent } from './components/main/main.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'main', component: MainComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'ia', loadComponent: () => import('./ia/ia.component').then(m => m.IaComponent) },
  { path: 'biblioteca', component: BibliotecaComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'terminos', component: TerminosComponent },
  { path: '**', redirectTo: 'login' } // Página de error 404
];
