import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { TerminosComponent } from './components/terminos/terminos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  { path: 'ia', loadComponent: () => import('./ia/ia.component').then(m => m.IaComponent) },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'terminos', component: TerminosComponent },
  { path: '**', redirectTo: 'login' } // Página de error 404
];
