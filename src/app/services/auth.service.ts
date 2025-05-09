import { Injectable, NgZone, inject } from '@angular/core';
import { 
  Auth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Firestore, doc, setDoc, getDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual: User | null = null;
  private firestore = inject(Firestore);

  constructor(
    private auth: Auth, 
    private router: Router, 
    private ngZone: NgZone
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioActual = user;
      this.auth.languageCode = 'es';
    });
  }

  // Método para enviar correo de recuperación
  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  // Método para verificar si el email existe en Firebase
  async checkIfEmailExists(email: string): Promise<boolean> {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      return false;
    }
  }

  getUserData(uid: string): Observable<any> {
    return new Observable(observer => {
      const userDocRef = doc(this.firestore, 'usuarios', uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        observer.next(docSnap.exists() ? docSnap.data() : null);
      });
      return () => unsubscribe();
    });
  }

  async updateUserData(uid: string, newData: any): Promise<void> {
    const userDocRef = doc(this.firestore, 'usuarios', uid);
    try {
      await updateDoc(userDocRef, newData);
      console.log("✅ Datos del usuario actualizados correctamente");
    } catch (error) {
      console.error("❌ Error al actualizar datos del usuario:", error);
      throw error;
    }
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable(observer => {
      return onAuthStateChanged(this.auth, user => {
        observer.next(user);
      });
    });
  }

  async sendVerificationEmail(user: User): Promise<void> {
    if (!user) return;
    try {
      await sendEmailVerification(user, {
        url: 'https://inventario-ganado-38a26.firebaseapp.com?lang=es', 
        handleCodeInApp: true
      });      
      console.log("✅ Correo de verificación enviado en español.");
    } catch (error) {
      console.error("❌ Error al enviar verificación:", error);
    }
  }  

  async register(email: string, password: string, extraData: any) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      await this.sendVerificationEmail(userCredential.user);
      
      const userDocRef = doc(this.firestore, `usuarios/${userCredential.user.uid}`);
      await setDoc(userDocRef, {
        email,
        ...extraData
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  }
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        throw { code: 'auth/email-not-verified' };
      }

      const userRef = doc(this.firestore, 'usuarios', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "Usuario sin nombre",
          birthDate: "",
          phone: "",
          farmName: "",
          email: user.email,
          uid: user.uid,
          createdAt: new Date()
        });
      }

      this.ngZone.run(() => this.router.navigate(['/main']));
      return user;
    } catch (error: any) {
      console.error('Firebase Auth Error:', error);
      throw new Error(this.getFirebaseErrorMessage(error.code));
    }
  }  

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;
      if (!user) throw new Error("Error en la autenticación con Google.");

      const userRef = doc(this.firestore, 'usuarios', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "Usuario de Google",
          birthDate: "",
          phone: "",
          farmName: "",
          email: user.email,
          uid: user.uid,
          createdAt: new Date()
        });
      }

      this.ngZone.run(() => this.router.navigate(['/main']));
      return user;
    } catch (error: any) {
      console.error("Error en login con Google:", error);
      throw new Error("Ocurrió un error desconocido. Intenta nuevamente.");
    }
  }  

  async logout() {
    try {
      await signOut(this.auth);
      this.ngZone.run(() => this.router.navigate(['/login']));
    } catch (error: any) {
      throw error;
    }
  }

  async getUserId(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, user => resolve(user ? user.uid : null), reject);
    });
  }

  async updateProfile(name: string, photoURL: string) {
    if (this.usuarioActual) {
      await updateProfile(this.usuarioActual, { displayName: name, photoURL: photoURL });
    }
  }

  getAuthState(): Observable<User | null> {
    return new Observable(observer => {
      return onAuthStateChanged(this.auth, user => observer.next(user));
    });
  }  

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  private getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No se encontró una cuenta con este correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/email-already-in-use': 'Este correo ya está registrado.',
      'auth/invalid-email': 'Correo electrónico no válido.',
      'auth/weak-password': 'La contraseña es demasiado débil.',
      'auth/email-not-verified': 'Debes verificar tu correo.',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Inténtalo más tarde.'
    };
    return errorMessages[errorCode] || 'Ocurrió un error al iniciar sesión.';
  }
}
