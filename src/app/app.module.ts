import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { TerminosComponent } from './components/terminos/terminos.component';

// Firebase Configuración
import { firebaseProviders } from './firebase.config';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    UsuarioComponent,
    EditarPerfilComponent,
    TerminosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    FontAwesomeModule,
    MatTooltipModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    ...firebaseProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
