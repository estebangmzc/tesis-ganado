import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth, updateProfile } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EditarPerfilComponent {
  @Input() userData: any = { name: '', phone: '', farmName: '', birthDate: '' };
  @Output() cerrar = new EventEmitter<void>();
  errorMessage: string = '';

  constructor(private firestore: Firestore, private auth: Auth) {}

  async guardarCambios() {
    try {
      // Verificar si todos los campos tienen datos (sin espacios vacíos)
      if (!this.userData.name.trim() || 
          !this.userData.phone.trim() || 
          !this.userData.farmName.trim() || 
          !this.userData.birthDate.trim()) {
        this.errorMessage = '❌ Debes llenar todos los campos antes de guardar.';
        return;
      }

      const user = this.auth.currentUser;
      if (!user) throw new Error("No hay usuario autenticado.");

      const userDocRef = doc(this.firestore, 'usuarios', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const userDataToUpdate = {
        name: this.userData.name,
        phone: this.userData.phone,
        farmName: this.userData.farmName,
        birthDate: this.userData.birthDate
      };

      if (userDocSnap.exists()) {
        await updateDoc(userDocRef, userDataToUpdate);
      } else {
        await setDoc(userDocRef, userDataToUpdate);
      }

      await updateProfile(user, { displayName: this.userData.name });

      alert('✅ Perfil guardado correctamente.');
      this.errorMessage = '';
      this.cerrar.emit();
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      alert(`Error al actualizar perfil: ${error instanceof Error ? error.message : error}`);
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
