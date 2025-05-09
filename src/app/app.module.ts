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
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { MainComponent } from './components/main/main.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';

// Firebase Configuración
import { firebaseProviders } from './firebase.config';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordResetComponent,
    MainComponent,
    UsuarioComponent,
    EditarPerfilComponent,
    TerminosComponent,
    BibliotecaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    FontAwesomeModule,
    MatTooltipModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule, 
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
      toastClass: 'custom-toast' 
    })
  ],
  providers: [
    ...firebaseProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
