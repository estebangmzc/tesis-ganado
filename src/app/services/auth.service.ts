import { Injectable, NgZone } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual: User | null = null;

  constructor(private auth: Auth, private router: Router, private ngZone: NgZone) {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioActual = user;
    });
  }

  // LOGIN: Verifica si el correo está confirmado antes de permitir el acceso
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        throw new Error('auth/email-not-verified');
      }

      this.ngZone.run(() => this.router.navigate(['/main']));
      return user;
    } catch (error: any) {
      throw new Error(this.getFirebaseErrorMessage(error.code));
    }
  }

  // REGISTRO: Envía correo de verificación
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      throw new Error('auth/email-verification-sent');
    } catch (error: any) {
      throw new Error(this.getFirebaseErrorMessage(error.code));
    }
  }

  // LOGIN CON GOOGLE (No requiere verificación de correo)
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      this.ngZone.run(() => this.router.navigate(['/main']));
      return userCredential.user;
    } catch (error: any) {
      console.error("Error en Firebase Auth:", error);
      throw new Error("Ocurrió un error desconocido. Intenta nuevamente.");
    }
  }

  // CERRAR SESIÓN
  async logout() {
    try {
      await signOut(this.auth);
      this.ngZone.run(() => this.router.navigate(['/login']));
    } catch (error: any) {
      throw error;
    }
  }

  // OBTENER USUARIO ACTUAL
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // OBTENER UID DEL USUARIO (VERSIÓN CORREGIDA)
async getUserId(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(this.auth, (user) => {
      resolve(user ? user.uid : null);
    }, reject);
  });
}

  // REESTABLECER CONTRASEÑA
  async resetPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }

  // ACTUALIZAR PERFIL (Nombre y foto)
  async updateProfile(name: string, photoURL: string) {
    if (this.usuarioActual) {
      await updateProfile(this.usuarioActual, { displayName: name, photoURL: photoURL });
    }
  }

  // OBSERVAR CAMBIOS EN LA AUTENTICACIÓN
  getAuthState(): Observable<User | null> {
    return new Observable(observer => {
      onAuthStateChanged(this.auth, user => observer.next(user));
    });
  }

  // CONVERTIR ERRORES DE FIREBASE A MENSAJES CLAROS
  private getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'El correo no es válido.',
      'auth/user-not-found': 'No se encontró ninguna cuenta con este correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/email-not-verified': 'Debes verificar tu correo antes de iniciar sesión.',
      'auth/email-already-in-use': 'Este correo ya está en uso.',
      'auth/weak-password': 'La contraseña es demasiado débil.',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Inténtalo más tarde.',
      'auth/network-request-failed': 'Error de conexión. Revisa tu internet.',
    };

    return errorMessages[errorCode] || 'Ocurrió un error desconocido. Intenta nuevamente.';
  }
}
