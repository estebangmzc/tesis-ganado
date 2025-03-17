import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreDataConverter } from '@angular/fire/firestore';

export interface Ganado {
  id?: string;
  raza: string;
  sexo: string;
  edad: number;
  peso: number;
  precioPorKilo: number;
  totalPrecio: number;
  estadoSalud: string;
  proposito: string;
}

// Conversor para manejar correctamente los datos en Firestore
const ganadoConverter: FirestoreDataConverter<Ganado> = {
  toFirestore(ganado: Ganado) {
    return { ...ganado };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return { id: snapshot.id, ...data } as Ganado;
  }
};

@Injectable({
  providedIn: 'root',
})
export class GanadoService {
  
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async agregarGanado(ganado: Ganado) {
    console.log('Peso recibido en agregarGanado:', ganado.peso, 'Tipo:', typeof ganado.peso);
    try {
      const uid = await this.authService.getUserId();
      if (!uid) {
        throw new Error('No hay usuario autenticado.');
      }

      ganado.edad = Number(ganado.edad);
      ganado.peso = Number(ganado.peso);
      ganado.precioPorKilo = Number(ganado.precioPorKilo);
      ganado.totalPrecio = ganado.peso * ganado.precioPorKilo;

      const errorValidacion = this.validarGanado(ganado);
      if (errorValidacion) {
        throw new Error(errorValidacion);
      }

      const ganadoCollection = collection(this.firestore, `usuarios/${uid}/ganado`);
      const docRef = await addDoc(ganadoCollection, { ...ganado });

      console.log('Ganado agregado con ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error al agregar ganado:', error);
      throw error;
    }
  }

  obtenerGanado(): Observable<Ganado[]> {
    return new Observable<Ganado[]>((observer) => {
      this.authService.getUserId().then((uid) => {
        if (!uid) {
          observer.error('No hay usuario autenticado.');
          return;
        }

        // Aplicamos el conversor aquí
        const ganadoCollection = collection(this.firestore, `usuarios/${uid}/ganado`).withConverter(ganadoConverter);

        collectionData(ganadoCollection, { idField: 'id' })
          .subscribe({
            next: (data) => observer.next(data as Ganado[]),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
      }).catch(error => observer.error(error));
    });
  }

  obtenerTotalGeneral(): Observable<number> {
    return this.obtenerGanado().pipe(
      map((vacas) => vacas.reduce((total, vaca) => total + vaca.totalPrecio, 0))
    );
  }

  async actualizarGanado(id: string, nuevosDatos: Partial<Ganado>) {
    try {
      const uid = await this.authService.getUserId();
      if (!uid) throw new Error('No hay usuario autenticado.');

      const ganadoActual = await this.obtenerGanadoPorId(id);
      if (!ganadoActual) throw new Error('El registro no existe.');

      const datosActualizados: Ganado = {
        ...ganadoActual,
        ...nuevosDatos,
        totalPrecio: (nuevosDatos.peso ?? ganadoActual.peso) * (nuevosDatos.precioPorKilo ?? ganadoActual.precioPorKilo),
      };

      const errorValidacion = this.validarGanado(datosActualizados);
      if (errorValidacion) {
        throw new Error(errorValidacion);
      }

      const ganadoDocRef = doc(this.firestore, `usuarios/${uid}/ganado`, id);
      await updateDoc(ganadoDocRef, { ...datosActualizados });

      console.log('Ganado actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar ganado:', error);
      throw error;
    }
  }

  async obtenerGanadoPorId(id: string): Promise<Ganado | null> {
    try {
      const uid = await this.authService.getUserId();
      if (!uid) throw new Error('No hay usuario autenticado.');

      const ganadoSnap = await getDoc(doc(this.firestore, `usuarios/${uid}/ganado`, id));
      return ganadoSnap.exists() ? { id, ...(ganadoSnap.data() as Ganado) } : null;
    } catch (error) {
      console.error('Error al obtener ganado por ID:', error);
      return null;
    }
  }

  async eliminarGanado(id: string) {
    try {
      const uid = await this.authService.getUserId();
      if (!uid) throw new Error('No hay usuario autenticado.');

      await deleteDoc(doc(this.firestore, `usuarios/${uid}/ganado`, id));
      console.log('Ganado eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar ganado:', error);
      throw error;
    }
  }

  private validarGanado(ganado: Partial<Ganado>): string | null {
    if (!ganado.raza || ganado.raza.trim() === '') {
      return 'La raza es obligatoria.';
    }
    if (!ganado.sexo) {
      return 'El sexo es obligatorio.';
    }
    if (!ganado.estadoSalud) {
      return 'El estado de salud es obligatorio.';
    }
    if (!ganado.proposito) {
      return 'El propósito es obligatorio.';
    }
    if (isNaN(ganado.edad!) || ganado.edad! < 0) {
      return 'La edad debe ser un número válido mayor o igual a 0.';
    }
    if (isNaN(ganado.peso!) || ganado.peso! <= 0) {
      return 'El peso debe ser un número mayor a 0.';
    }
    if (isNaN(ganado.precioPorKilo!) || ganado.precioPorKilo! <= 0) {
      return 'El precio por kilo debe ser un número mayor a 0.';
    }
    if (isNaN(ganado.totalPrecio!) || ganado.totalPrecio! < 0) {
      return 'El total de precio debe ser un número mayor o igual a 0.';
    }
    if (ganado.sexo === 'Macho' && ganado.proposito === 'Leche') {
      return 'Un macho no puede tener el propósito "Leche".';
    }

    return null;
  }
}
