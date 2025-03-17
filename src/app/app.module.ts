import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { IaComponent } from './ia/ia.component';

// Firebase Configuración
import { firebaseProviders } from './firebase.config';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    IaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    RouterModule.forRoot(routes) // Configura las rutas aquí
  ],
  providers: [
    ...firebaseProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
