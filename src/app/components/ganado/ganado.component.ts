import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GanadoService, Ganado } from '../../services/ganado.service';
import { Observable } from 'rxjs';
import { Modal } from 'bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ganado',
  templateUrl: './ganado.component.html',
  styleUrls: ['./ganado.component.css']
})
export class GanadoComponent implements OnInit {
  ganado$!: Observable<Ganado[]>;
  nuevoGanado: Ganado = this.inicializarGanado();
  modoEdicion = false;
  ganadoEditando: Ganado = this.inicializarGanado();
  ganadoEditandoId: string = '';

  @ViewChild('modalDetalleGanado', { static: false }) modalRef!: ElementRef;

  constructor(private ganadoService: GanadoService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.ganado$ = this.ganadoService.obtenerGanado();
  }

  inicializarGanado(): Ganado {
    return {
      id: '',
      raza: '',
      sexo: 'Macho',
      edad: 0,
      peso: 0,
      precioPorKilo: 0,
      totalPrecio: 0,
      estadoSalud: 'Sano',
      proposito: 'Engorde',
    };
  }

  getFilteredPropositos(): string[] {
    return this.nuevoGanado.sexo === 'Macho' 
      ? ['Engorde', 'Reproducción', 'Venta'] 
      : ['Engorde', 'Leche', 'Reproducción', 'Venta'];
  }

  onSexoChange(): void {
    if (this.nuevoGanado.sexo === 'Macho' && this.nuevoGanado.proposito === 'Leche') {
      this.nuevoGanado.proposito = 'Engorde';
    }
  }

  validarGanado(ganado: Ganado): boolean {
    const errores = [];
  
    if (!ganado.raza.trim()) errores.push('⚠️ La raza es obligatoria.');
    if (!ganado.sexo) errores.push('⚠️ Selecciona el sexo del ganado.');
    if (ganado.edad < 0) errores.push('⚠️ La edad no puede ser negativa.');
    if (ganado.peso <= 0 || ganado.precioPorKilo <= 0) {
      errores.push('⚠️ El peso y el precio por kilo deben ser mayores a 0.');
    }
    if (ganado.sexo === 'Macho' && ganado.proposito === 'Leche') {
      errores.push('⚠️ Un macho no puede tener el propósito de Leche.');
    }
  
    if (errores.length > 0) {
      this.mostrarAlerta(errores.join('\n'));
      return false;
    }
  
    return true;
  }  

  agregarGanado() {
    // Convertir valores null a 0 para evitar errores en el cálculo
    this.nuevoGanado.edad = this.nuevoGanado.edad ?? 0;
    this.nuevoGanado.peso = this.nuevoGanado.peso ?? 0;
    this.nuevoGanado.precioPorKilo = this.nuevoGanado.precioPorKilo ?? 0;

    if (!this.validarGanado(this.nuevoGanado)) return;

    // Calcular totalPrecio solo si peso y precioPorKilo son mayores a 0
    this.nuevoGanado.totalPrecio = 
        this.nuevoGanado.peso > 0 && this.nuevoGanado.precioPorKilo > 0 
        ? this.nuevoGanado.peso * this.nuevoGanado.precioPorKilo 
        : 0;

    this.ganadoService.agregarGanado(this.nuevoGanado)
      .then(() => {
        this.mostrarAlerta('✅ Ganado agregado exitosamente.');
        this.nuevoGanado = this.inicializarGanado();
      })
      .catch(error => {
        console.error('Error al agregar ganado:', error);
        this.mostrarAlerta(`❌ Error al agregar ganado: ${error.message}`);
      });
}

  seleccionarGanado(ganado: Ganado) {
    this.modoEdicion = true;
    this.ganadoEditando = { ...ganado };
    this.ganadoEditandoId = ganado.id ?? '';

    if (this.modalRef) {
      const modal = new Modal(this.modalRef.nativeElement);
      modal.show();
    }
  }

  guardarEdicion() {
    if (!this.ganadoEditandoId || this.ganadoEditandoId.trim() === '') {
      this.mostrarAlerta('⚠️ Error: No hay datos válidos para actualizar.');
      return;
    }
    if (!this.validarGanado(this.ganadoEditando)) return;
    this.ganadoEditando.totalPrecio = this.ganadoEditando.peso * this.ganadoEditando.precioPorKilo;

    this.ganadoService.actualizarGanado(this.ganadoEditandoId, this.ganadoEditando)
      .then(() => {
        this.mostrarAlerta('✅ Ganado actualizado correctamente.');
        this.cancelarEdicion();
      })
      .catch(error => {
        console.error('Error al actualizar ganado:', error);
        this.mostrarAlerta(`❌ Error al actualizar ganado: ${error.message}`);
      });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.ganadoEditandoId = '';
    this.ganadoEditando = this.inicializarGanado();
  }

  mostrarAlerta(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}

