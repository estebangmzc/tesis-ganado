import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { Ganado, GanadoService } from '../../services/ganado.service';
import { PdfService } from '../../services/pdf.service';
import { ExcelService } from '../../services/excel.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: true,
  providers: [GanadoService],
  imports: [CommonModule, FormsModule],
})
export class MainComponent implements OnInit, OnDestroy {
  razasDisponibles: string[] = ["Brahman", "GYR", "Holstein", "Jersey", "Normando", "Cebú"];
  ganado$: Observable<Ganado[]>;
  ganadoFiltrado: Ganado[] = [];
  totalValor: number = 0;
  filtro: string = '';
  filtroRaza: string = '';
  filtroSexo: string = '';
  filtroEstadoSalud: string = '';
  filtroProposito: string = '';
  menuOpen = false;
  vistaActual: string = 'main';
  mostrarIA = true; 
  totalVacas: number = 0;

  nuevoGanado: Ganado = { 
    raza: '',
    sexo: 'Macho',
    edad: 0,
    peso: 0,
    precioPorKilo: 0,
    totalPrecio: 0,
    estadoSalud: 'Sano',
    proposito: 'Engorde'
  };

  ganadoSeleccionado: Ganado | null = null;
  private ganadoSubscription?: Subscription;
  private modalInstance?: bootstrap.Modal;
  private listaGanado: Ganado[] = [];

  constructor(
    private ganadoService: GanadoService, 
    private pdfService: PdfService,  
    private excelService: ExcelService,
    private authService: AuthService, // Servicio de autenticación
    private router: Router // Para la navegación
  ) { 
    this.ganado$ = this.ganadoService.obtenerGanado();
  }  

  ngOnInit(): void {
    this.ganadoSubscription = this.ganado$.subscribe(ganadoList => {
      this.listaGanado = ganadoList;
      this.ganadoFiltrado = [...ganadoList];
      this.totalValor = ganadoList.reduce((total, vaca) => total + vaca.totalPrecio, 0);
      this.totalVacas = ganadoList.length; // Agrega esta línea
    });
  }
  
  ngOnDestroy(): void {
    this.ganadoSubscription?.unsubscribe();
  }
  
  agregarGanado() {
    this.nuevoGanado.peso = Number(this.nuevoGanado.peso);
    this.nuevoGanado.precioPorKilo = Number(this.nuevoGanado.precioPorKilo);
    this.nuevoGanado.edad = Number(this.nuevoGanado.edad);

    // Errores que solo se muestran en la consola
    if (isNaN(this.nuevoGanado.peso) || this.nuevoGanado.peso <= 0) {
        console.error("❌ Error: El peso debe ser un número mayor a 0.");
        return;
    }
    if (isNaN(this.nuevoGanado.precioPorKilo) || this.nuevoGanado.precioPorKilo <= 0) {
        console.error("❌ Error: El precio por kilo debe ser mayor a 0.");
        return;
    }
    if (isNaN(this.nuevoGanado.edad) || this.nuevoGanado.edad < 0) {
        console.error("❌ Error: La edad no puede ser negativa.");
        return;
    }

    // ✅ Único error que se muestra en la interfaz con Swal.fire
    if (this.nuevoGanado.sexo === "Macho" && this.nuevoGanado.proposito === "Leche") {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Un macho no puede tener como propósito 'Leche'.",
            confirmButtonColor: "#d33"
        });
        return;
    }

    // Cálculo del precio total
    this.nuevoGanado.totalPrecio = this.nuevoGanado.peso * this.nuevoGanado.precioPorKilo;

    this.ganadoService.agregarGanado(this.nuevoGanado)
        .then(() => {
            console.log("✅ Ganado agregado con éxito.");
            this.nuevoGanado = {
                raza: '',
                sexo: 'Macho',
                edad: 0,
                peso: 0,
                precioPorKilo: 0,
                totalPrecio: 0,
                estadoSalud: 'Sano',
                proposito: 'Engorde'
            };
        })
        .catch(error => {
            console.error("❌ Error: No se pudo agregar el ganado: ", error.message);
        });
}

  seleccionarGanado(vaca: Ganado) {
    this.ganadoSeleccionado = { ...vaca };
    const modalElement = document.getElementById('modalDetalleGanado');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  actualizarGanado() {
    if (this.ganadoSeleccionado?.id) {
      this.ganadoService.actualizarGanado(this.ganadoSeleccionado.id, this.ganadoSeleccionado)
        .then(() => {
          console.log("Ganado actualizado con éxito.");
          this.ganadoSeleccionado = null;
          this.modalInstance?.hide();
        })
        .catch(error => {
          console.error("Error: No se pudo actualizar el ganado: ", error.message);
        });
    } else {
      console.error("Error: El ganado seleccionado no tiene un ID válido.");
    }
  }

  eliminarGanado(id: string) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            this.ganadoService.eliminarGanado(id)
                .then(() => {
                    console.log("✅ Ganado eliminado con éxito.");
                })
                .catch(error => {
                    console.error("❌ Error: No se pudo eliminar el ganado: ", error.message);
                });
        }
    });
}

  filtrarGanado() {
    let ganadoFiltrado = [...this.listaGanado];

    if (this.filtro) {
      const filtroLower = this.filtro.toLowerCase();
      ganadoFiltrado = ganadoFiltrado.filter(vaca =>
        vaca.raza.toLowerCase().includes(filtroLower) ||
        vaca.sexo.toLowerCase().includes(filtroLower) ||
        vaca.estadoSalud.toLowerCase().includes(filtroLower) ||
        vaca.proposito.toLowerCase().includes(filtroLower)
      );
    }

    if (this.filtroRaza) ganadoFiltrado = ganadoFiltrado.filter(vaca => vaca.raza === this.filtroRaza);
    if (this.filtroSexo) ganadoFiltrado = ganadoFiltrado.filter(vaca => vaca.sexo === this.filtroSexo);
    if (this.filtroEstadoSalud) ganadoFiltrado = ganadoFiltrado.filter(vaca => vaca.estadoSalud === this.filtroEstadoSalud);
    if (this.filtroProposito) ganadoFiltrado = ganadoFiltrado.filter(vaca => vaca.proposito === this.filtroProposito);

    this.ganadoFiltrado = ganadoFiltrado;
  }

  limpiarFiltros() {
    this.filtro = '';
    this.filtroRaza = '';
    this.filtroSexo = '';
    this.filtroEstadoSalud = '';
    this.filtroProposito = '';
    this.filtrarGanado();
  }

  exportarPDF() {
    if (this.listaGanado.length === 0) {
      console.warn("Atención: No hay datos de ganado para exportar.");
      return;
    }
    this.pdfService.generarPDF(this.listaGanado);
  }

  exportarExcel() {
    if (this.listaGanado.length === 0) {
      console.warn("Atención: No hay datos de ganado para exportar.");
      return;
    }
    this.excelService.exportToExcel(this.listaGanado, 'InventarioGanado');
  }
}

   