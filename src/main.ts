import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from './environments/environment'; // Asegúrate de que environment.ts tiene firebaseConfig
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Necesario para Toastr
import { provideToastr } from 'ngx-toastr'; // Nueva forma recomendada para standalone

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./app/components/login/login.component').then(m => m.LoginComponent) },
  { path: 'main', loadComponent: () => import('./app/components/main/main.component').then(m => m.MainComponent) },
  { path: 'estadisticas', loadComponent: () => import('./app/components/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent) },
  { path: 'ia', loadComponent: () => import('./app/ia/ia.component').then(m => m.IaComponent) },
  { path: 'usuario', loadComponent: () => import('./app/components/usuario/usuario.component').then(m => m.UsuarioComponent) },
  { path: 'terminos', loadComponent: () => import('./app/components/terminos/terminos.component').then(m => m.TerminosComponent) },
  { path: 'biblioteca', loadComponent: () => import('./app/components/biblioteca/biblioteca.component').then(m => m.BibliotecaComponent) }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Inicializa Firebase con la config de env
    provideFirestore(() => getFirestore()), // Habilita Firestore
    provideAuth(() => getAuth()), // Habilita Auth si lo necesitas
    provideStorage(() => getStorage()), // Habilita Storage si lo necesitas
    importProvidersFrom(
      RouterModule.forRoot(appRoutes),
      BrowserAnimationsModule, // 🔥 Necesario para Toastr
      ToastrModule.forRoot() // ✅ Configuración correcta para Toastr
    ),
    provideToastr() // ✅ Nueva forma de agregar Toastr en standalone
  ],
}).catch(err => console.error('❌ Error al iniciar la aplicación:', err.message, err));
