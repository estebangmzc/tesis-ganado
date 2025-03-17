import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from './environments/environment'; // Asegúrate de que environment.ts tiene firebaseConfig
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./app/components/login/login.component').then(m => m.LoginComponent) },
  { path: 'main', loadComponent: () => import('./app/components/main/main.component').then(m => m.MainComponent) },
  { path: 'ia', loadComponent: () => import('./app/ia/ia.component').then(m => m.IaComponent) }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Inicializa Firebase con la config de env
    provideFirestore(() => getFirestore()), // Habilita Firestore
    provideAuth(() => getAuth()), // Habilita Auth si lo necesitas
    provideStorage(() => getStorage()), // Habilita Storage si lo necesitas
    importProvidersFrom(RouterModule.forRoot(appRoutes))

  ],
}).catch(err => console.error('❌ Error al iniciar la aplicación:', err.message, err));

