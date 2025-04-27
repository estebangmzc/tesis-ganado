import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, Subscription, switchMap, of } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

interface Ganado {
  id: string;
  raza: string;
  sexo: string;
  edad: number;
  peso: number;
  precioPorKilo: number;
  totalPrecio: number;
  estadoSalud: string;
  proposito: string;
  fechaRegistro: Date;
}

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, OnDestroy {
  ganado$: Observable<Ganado[]>;
  private ganadoSubscription!: Subscription;
  ganado: Ganado[] = [];
  mostrarGraficos: boolean = false;
  categoriaSeleccionada: string = '';
  mensaje: string = '';

  calcularPesoPromedio(ganado: Ganado[]): number {
    if (ganado.length === 0) return 0;
    return Number((ganado.reduce((sum, vaca) => sum + vaca.peso, 0) / ganado.length).toFixed(2));
  }  

  contarPorCategoria(ganado: any[], campo: string, valor: string): number {
    return ganado.filter(vaca => vaca[campo] === valor).length;
  }

  calcularValorTotalGanado(ganado: any[]): number {
    return ganado.reduce((sum, vaca) => sum + vaca.totalPrecio, 0);
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.cdr.detectChanges();
    this.generarGraficos();
  }  

  contarPorPropiedad<K extends keyof Ganado>(propiedad: K, valores: string[]): number[] {
    const conteo = new Map<string, number>();
  
    valores.forEach(valor => conteo.set(valor.toLowerCase().trim(), 0));
  
    for (const vaca of this.ganado) {
      const propiedadValor = String(vaca[propiedad]).toLowerCase().trim();
  
      if (conteo.has(propiedadValor)) {
        conteo.set(propiedadValor, (conteo.get(propiedadValor) || 0) + 1);
      }
    }
  
    return valores.map(valor => conteo.get(valor.toLowerCase().trim()) || 0);
  }  

  calcularPesoPromedioPorPropósito(propositos: string[]): number[] {
    return propositos.map(prop => {
      const vacasPorProp = this.ganado.filter(vaca => vaca.proposito === prop);
      
      if (vacasPorProp.length === 0) return 0;
      
      const pesoTotal = vacasPorProp.reduce((sum, vaca) => sum + vaca.peso, 0);
      return pesoTotal / vacasPorProp.length;
    });
  }

  calcularPesoPromedioPorEdad(): number[] {
    const edades = [
      { rango: '0-6 meses', totalPeso: 0, cantidad: 0 },
      { rango: '7-12 meses', totalPeso: 0, cantidad: 0 },
      { rango: '1-2 años', totalPeso: 0, cantidad: 0 },
      { rango: '3+ años', totalPeso: 0, cantidad: 0 }
    ];
  
    this.ganado.forEach(vaca => {
      if (vaca.edad <= 6) {
        edades[0].totalPeso += vaca.peso;
        edades[0].cantidad++;
      } else if (vaca.edad <= 12) {
        edades[1].totalPeso += vaca.peso;
        edades[1].cantidad++;
      } else if (vaca.edad <= 24) {
        edades[2].totalPeso += vaca.peso;
        edades[2].cantidad++;
      } else {
        edades[3].totalPeso += vaca.peso;
        edades[3].cantidad++;
      }
    });
  
    return edades.map(e => e.cantidad > 0 ? e.totalPeso / e.cantidad : 0);
  }

  @ViewChild('graficoProp') graficoProp!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoSexo') graficoSexo!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoPeso') graficoPeso!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoSalud') graficoSalud!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoEdadPeso', { static: false }) graficoEdadPeso!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoValor') graficoValor!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoPrediccion') graficoPrediccion!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoPesoValor') graficoPesoValor!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  constructor(private firestore: Firestore, private auth: Auth, private cdr: ChangeDetectorRef, private toastr: ToastrService) {
    this.ganado$ = user(this.auth).pipe(
      switchMap((usuario) => {
        if (!usuario) return of([]);
        const ganadoRef = collection(this.firestore, `usuarios/${usuario.uid}/ganado`);
        return collectionData(ganadoRef, { idField: 'id' }) as Observable<Ganado[]>;
      })
    );
  }

  ngOnInit() {
    this.ganadoSubscription?.unsubscribe();
  
    this.ganadoSubscription = this.ganado$.subscribe((ganado) => {
      this.ganado = ganado;
    });
  }  

  ngOnDestroy() {
    if (this.ganadoSubscription) {
      this.ganadoSubscription.unsubscribe();
    }
  }

    generarGraficos() {
      this.mostrarGraficos = true;
      this.limpiarGraficos();
    
      if (this.categoriaSeleccionada) {
        this.crearGraficoValor();
        this.crearGraficoPesoValor();
        this.crearGraficoProp();
        this.crearGraficoSexo();
        this.crearGraficoSalud();
        this.crearGraficoPesoEdad();
        this.crearGraficoPrediccion();
      }
    }  

 private crearGrafico(
  canvasRef: ElementRef<HTMLCanvasElement>, 
  tipo: string, 
  titulo: string, 
  etiquetas: string[], 
  datos: number[], 
  colores: string[], 
  enteros: boolean,
  mostrarLeyendaCuadro: boolean = true,
  esMoneda: boolean = false
) {
  if (!canvasRef?.nativeElement) return;
  const ctx = canvasRef.nativeElement.getContext('2d');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: tipo as any,
    data: {
      labels: etiquetas,
      datasets: [{
        label: titulo,
        data: datos.map(d => enteros ? Math.round(d) : d),
        backgroundColor: colores.map(color => `${color}B3`),
        borderColor: colores,
        borderWidth: 2,
        borderRadius: 5,
        hoverBackgroundColor: colores.map(color => `${color}D9`),
        hoverBorderWidth: 3,
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            boxWidth: mostrarLeyendaCuadro ? 12 : 0,
            font: {
              size: 14,
              weight: 'bold'
            },
            color: '#222'
          }
        },
        tooltip: {
          backgroundColor: '#333',
          titleFont: { size: 16, weight: 'bold' },
          bodyFont: { size: 14 },
          displayColors: false,
          position: 'nearest', // Cambia la posición a 'nearest' para que el tooltip esté cerca del punto
          callbacks: {
            label: (tooltipItem: { raw: number }) => 
              esMoneda 
              ? ` $${tooltipItem.raw.toLocaleString()} Pesos`
              : ` ${tooltipItem.raw.toLocaleString()} kg`
          }
        }
      },
      scales: tipo !== 'pie' && tipo !== 'doughnut' ? {
        y: {
          beginAtZero: true,
          grid: {
            color: '#DDD',
            borderDash: [5, 5]
          },
          ticks: {
            font: {
              size: 13
            },
            callback: (value: number) => 
              esMoneda 
              ? `$${value.toLocaleString()}` 
              : `${value.toLocaleString()} kg`
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 13
            }
          }
        }
      } : {}, // Para gráficos de pastel o doughnut, no mostramos los ejes
      animation: {
        duration: 1500,
        easing: 'easeOutBounce'
      }
    }
  });

  this.charts.push(chart);
}                   

    private calcularMesesAtras(fechaRegistro: any): number {
      if (!fechaRegistro || isNaN(new Date(fechaRegistro).getTime())) return NaN;
      
      const fecha = fechaRegistro.seconds 
        ? new Date(fechaRegistro.seconds * 1000) 
        : new Date(fechaRegistro);
      
      const fechaActual = new Date();
      return (fechaActual.getFullYear() - fecha.getFullYear()) * 12 + (fechaActual.getMonth() - fecha.getMonth());
    }    
    
    private obtenerHistoricoPesos(): number[] {
      const ganadoConFecha = this.ganado.filter(v => v.fechaRegistro);
      
      const datosPasados2Meses = ganadoConFecha
        .filter(v => this.calcularMesesAtras(v.fechaRegistro) === 2)
        .map(v => v.peso);
    
      const datosPasados1Mes = ganadoConFecha
        .filter(v => this.calcularMesesAtras(v.fechaRegistro) === 1)
        .map(v => v.peso);
    
      const datosActuales = ganadoConFecha
        .filter(v => this.calcularMesesAtras(v.fechaRegistro) === 0)
        .map(v => v.peso);
    
      const promedio = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    
      return [promedio(datosPasados2Meses), promedio(datosPasados1Mes), promedio(datosActuales)];
    }
    
    private limpiarGraficos() {
      this.charts.forEach(chart => chart.destroy());
      this.charts = [];
    }    
     
    // CREATE GRAFICOS

    private crearGraficoValor() {
      const propositos = ['Engorde', 'Leche', 'Reproducción', 'Venta'];
  
      const valoresPorProp = propositos.map(prop => 
        this.ganado
          .filter(vaca => vaca.proposito === prop)
          .reduce((sum, vaca) => sum + vaca.totalPrecio, 0)
      );
  
      this.crearGrafico(
        this.graficoValor,
        'bar',
        '',
        propositos,
        valoresPorProp,
        ['#2ECC71', '#F1C40F', '#E74C3C', '#9B59B6'], 
        true,
        false,
        true 
      );
  }  
        
    private crearGraficoPesoValor() {
      if (this.ganado.length === 0) return;
    
      const pesoMin = Math.min(...this.ganado.map(v => v.peso));
      const pesoMax = Math.max(...this.ganado.map(v => v.peso));

      const numRangos = 5;
      const tamanoRango = Math.ceil((pesoMax - pesoMin) / numRangos);
    
      let rangos: { min: number; max: number; label: string; totalValor: number }[] = [];
      
      for (let i = 0; i < numRangos; i++) {
        const min = pesoMin + i * tamanoRango;
        const max = min + tamanoRango - 1;
        rangos.push({ min, max, label: `${min}-${max}kg`, totalValor: 0 });
      }
    
      this.ganado.forEach(vaca => {
        const valorTotal = vaca.peso * vaca.precioPorKilo;
        for (let rango of rangos) {
          if (vaca.peso >= rango.min && vaca.peso <= rango.max) {
            rango.totalValor += valorTotal;
            break;
          }
        }
      });
    
      rangos = rangos.filter(r => r.totalValor > 0);
      const etiquetas = rangos.map(r => r.label);
      const valores = rangos.map(r => r.totalValor);
    
      this.crearGrafico(
        this.graficoPesoValor,
        'bar',
        '', // Se elimina el título pequeño
        etiquetas,
        valores,
        ['#FF5733'],
        false,
        false,
        true
      );      
    }                    

    private crearGraficoPesoEdad() {
      this.crearGrafico(
        this.graficoEdadPeso, 
        'line', 
        'Peso Promedio por Edad',
        ['0-6 meses', '7-12 meses', '1-2 años', '3+ años'],
        this.calcularPesoPromedioPorEdad(),
        ['#FF5733'], 
        false,
        true
      );
    }     

    private crearGraficoProp() {
      const propositos = ['Engorde', 'Leche', 'Reproducción', 'Venta'];
      const colores = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
      const pesosPromedio = this.calcularPesoPromedioPorPropósito(propositos);
    
      this.crearGrafico(
        this.graficoProp,
        'bar',
        'Peso Promedio por Propósito',
        propositos,
        pesosPromedio,
        colores,
        false,  // No redondear los valores
        false,   // Mostrar leyenda
        false   // No mostrar kg ni pesos en el tooltip
      );
    }        

    private crearGraficoSexo() {
      this.crearGrafico(
          this.graficoSexo,
          'doughnut',
          'Distribución por Sexo',
          ['Macho', 'Hembra'],
          this.contarPorPropiedad('sexo', ['Macho', 'Hembra']),
          ['#FF6384', '#36A2EB'],
          true,
          true, // Mantiene la leyenda
          false // Evita mostrar kg o pesos
      );
  }
  
  private crearGraficoSalud() {
      const datos = this.contarPorPropiedad('estadoSalud', ['Sano', 'Enfermo', 'En Tratamiento']);
  
      this.crearGrafico(
          this.graficoSalud,
          'pie',
          'Estado de Salud del Ganado',
          ['Sano', 'Enfermo', 'En Tratamiento'],
          datos,
          ['#2ECC71', '#E74C3C', '#F1C40F'],
          true,
          true, // Mantiene la leyenda
          false // Evita mostrar kg o pesos
      );
  }                          

  private crearGraficoPrediccion() {
    const historicoPesos = this.obtenerHistoricoPesos();
  
    if (historicoPesos.length < 3 || historicoPesos.every(p => p === 0)) {
  
      this.mensaje = "Este gráfico requiere datos históricos para hacer predicciones. A medida que pase el tiempo y se registren más datos, se podrá generar una proyección del peso.";    
  
      // Genera el gráfico vacío con valores predeterminados
      this.crearGrafico(this.graficoPrediccion, 'line', 'Predicción de Peso Promedio',
        ['Mes Actual', 'Próximo Mes', '2 Meses'],
        [0, 0, 0], 
        ['#8E44AD'], false);
      return;
    }
  
    // Si hay suficientes datos, limpiamos el mensaje
    this.mensaje = '';
  
    let tendencia = historicoPesos[2] - historicoPesos[1];
  
    if (tendencia < 0) {
      console.warn("⚠️ La tendencia es negativa, ajustando valores.");
      tendencia = 0;
    }
  
    const proyeccion1 = historicoPesos[2] + tendencia;
    const proyeccion2 = proyeccion1 + tendencia;
  
    // Genera el gráfico con los valores calculados
    this.crearGrafico(this.graficoPrediccion, 'line', 'Predicción de Peso Promedio',
      ['Mes Actual', 'Próximo Mes', '2 Meses'],
      [historicoPesos[2], proyeccion1, proyeccion2],
      ['#8E44AD'], false, true, false);
  }
}