import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() { }

  async generarPDF(ganado: any[]) {
    const doc = new jsPDF();

    // 📌 Marca de agua
    doc.setFontSize(90);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(230, 230, 230);
    doc.text('INVENTARIO', 115, 215, { angle: 20, align: 'center' });
    doc.setTextColor(0, 0, 0);

    // 📌 Logo
    const imgUrl = 'assets/fotos/vaca-ia.png';
    doc.setFillColor(200, 200, 200);
    doc.rect(155, 5, 45, 45, 'F');
    doc.addImage(imgUrl, 'PNG', 160, 10, 35, 35);

    // 📌 Título y fecha
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventario de Ganado', 14, 15);
    const fechaActual = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Fecha: ${fechaActual}`, 14, 25);

    // 📌 Estadísticas
    const totalCabezas = ganado.length;
    const pesoPromedio = totalCabezas > 0 ? (ganado.reduce((sum, vaca) => sum + vaca.peso, 0) / totalCabezas).toFixed(2) : '0';
    const capitalTotal = ganado.reduce((sum, vaca) => sum + vaca.totalPrecio, 0).toFixed(2);

    doc.text(`Total de cabezas de ganado: ${totalCabezas}`, 14, 35);
    doc.text(`Peso promedio del ganado: ${pesoPromedio} kg`, 14, 45);
    doc.text(`Capital total en ganado: $${capitalTotal}`, 14, 55);

    // 📌 Tabla
    const columnas = ['Raza', 'Sexo', 'Edad', 'Peso (kg)', 'Precio x Kg', 'Total Precio', 'Estado de Salud', 'Propósito'];
    const filas = ganado.map(vaca => [
      vaca.raza, vaca.sexo, vaca.edad, vaca.peso,
      `$${vaca.precioPorKilo}`, `$${vaca.totalPrecio}`,
      vaca.estadoSalud, vaca.proposito,
    ]);

    autoTable(doc, {
      startY: 70,
      head: [columnas],
      body: filas,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 },
    });

    // 📌 Posición después de la tabla
    let finalY = (doc as any).lastAutoTable.finalY || 100;
    finalY += 20;

// 📊 Gráfico 1: Distribución del Peso Promedio del Ganado
const canvasPesoPromedio = document.createElement('canvas');
canvasPesoPromedio.width = 600;
canvasPesoPromedio.height = 300;
const ctxPesoPromedio = canvasPesoPromedio.getContext('2d');

if (ctxPesoPromedio) {
  const razasPeso = ganado.reduce((acc, vaca) => {
    if (!acc[vaca.raza]) {
      acc[vaca.raza] = { totalPeso: 0, cantidad: 0 };
    }
    acc[vaca.raza].totalPeso += vaca.peso;
    acc[vaca.raza].cantidad += 1;
    return acc;
  }, {} as Record<string, { totalPeso: number, cantidad: number }>);

  const razas = Object.keys(razasPeso);
  const pesoPromedio = razas.map(raza => razasPeso[raza].totalPeso / razasPeso[raza].cantidad);

  new Chart(ctxPesoPromedio, {
    type: 'bar',
    data: {
      labels: razas,
      datasets: [{
        label: 'Peso Promedio (kg) por Raza',
        data: pesoPromedio,
        backgroundColor: 'rgba(255, 159, 64, 0.8)',  // Color de las barras
        borderColor: '#FF7F50',  // Color de borde
        borderWidth: 1,
        borderRadius: 5, // Bordes redondeados para las barras
        hoverBackgroundColor: 'rgba(255, 159, 64, 1)', // Color al pasar el cursor
        hoverBorderColor: '#FF7F50',
        barPercentage: 0.8, // Establecer el ancho de las barras
      }]
    },
    options: {
      responsive: false,  // Desactivar la opción de responsividad
      plugins: { 
        legend: { display: false }, // Ocultar leyenda
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#000',
          bodyColor: '#333',
          borderColor: '#ccc',
          borderWidth: 1
        }
      },
      scales: {
        y: { 
          title: { display: true, text: 'Peso Promedio (kg)' },
          beginAtZero: true, 
          ticks: { 
            precision: 0,
            callback: function(value) { return (Number(value) || 0).toFixed(0); }
          },
          grid: {
            color: '#ddd'  // Líneas de la cuadrícula más suaves
          }
        },
        x: { 
          title: { display: true, text: 'Razas de Ganado' },
          grid: {
            display: false, // Quitar líneas en el eje X
          }
        }
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 500));  // Tiempo de espera para la generación de la imagen
  const pesoPromedioImage = canvasPesoPromedio.toDataURL('image/png');

  // 📌 Verificar espacio y agregar nueva página si es necesario
  if (finalY + 90 > doc.internal.pageSize.height) {
    doc.addPage();
    finalY = 20; // Reiniciar en la nueva página
  }

  doc.addImage(pesoPromedioImage, 'PNG', 20, finalY, 160, 80); // Agregar la imagen al PDF
  finalY += 90;  // Aumentar el espacio para el siguiente gráfico
}

// 📊 Gráfico 2: Valor Total por Raza
const canvasValorTotal = document.createElement('canvas');
canvasValorTotal.width = 600;
canvasValorTotal.height = 300;
const ctxValorTotal = canvasValorTotal.getContext('2d');

if (ctxValorTotal) {
  const estadisticasValor = ganado.reduce((acc, vaca) => {
    if (!acc[vaca.raza]) {
      acc[vaca.raza] = 0;
    }
    acc[vaca.raza] += vaca.peso * vaca.precioPorKilo;
    return acc;
  }, {} as Record<string, number>);

  const razas = Object.keys(estadisticasValor);
  const valorTotal = razas.map(raza => estadisticasValor[raza]);

  new Chart(ctxValorTotal, {
    type: 'bar',
    data: {
      labels: razas,
      datasets: [{
        label: 'Valor Total ($) por Raza',
        data: valorTotal,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',  // Color de las barras
        borderColor: '#1C8D73',  // Color de borde
        borderWidth: 1,
        borderRadius: 5,  // Bordes redondeados para las barras
        hoverBackgroundColor: 'rgba(75, 192, 192, 1)',  // Color al pasar el cursor
        hoverBorderColor: '#1C8D73',
        barPercentage: 0.8,  // Establecer el ancho de las barras
      }]
    },
    options: {
      responsive: false,  // Desactivar la opción de responsividad
      plugins: { 
        legend: { display: false },  // Ocultar leyenda
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#000',
          bodyColor: '#333',
          borderColor: '#ccc',
          borderWidth: 1
        }
      },
      scales: {
        y: { 
          title: { display: true, text: 'Valor Total ($)' },
          beginAtZero: true,
          ticks: { 
            precision: 0,
            callback: function(value) { return `$${(Number(value) || 0).toFixed(0)}`; }
          },
          grid: {
            color: '#ddd'  // Líneas de la cuadrícula más suaves
          }
        },
        x: { 
          title: { display: true, text: 'Razas de Ganado' },
          grid: {
            display: false, // Quitar líneas en el eje X
          }
        }
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 500));  // Tiempo de espera para la generación de la imagen
  const valorTotalImage = canvasValorTotal.toDataURL('image/png');

  // 📌 Verificar espacio y agregar nueva página si es necesario
  if (finalY + 90 > doc.internal.pageSize.height) {
    doc.addPage();
    finalY = 20; // Reiniciar en la nueva página
  }

  doc.addImage(valorTotalImage, 'PNG', 20, finalY, 160, 80);  // Agregar la imagen al PDF
  finalY += 90;  // Aumentar el espacio para el siguiente gráfico
}

// 📊 Gráfico 3: Cantidad de Ganado por Raza
const canvasCantidadGanado = document.createElement('canvas');
canvasCantidadGanado.width = 600;
canvasCantidadGanado.height = 300;
const ctxCantidadGanado = canvasCantidadGanado.getContext('2d');

if (ctxCantidadGanado) {
  const estadisticasCantidad = ganado.reduce((acc, vaca) => {
    if (!acc[vaca.raza]) {
      acc[vaca.raza] = 0;
    }
    acc[vaca.raza] += 1;
    return acc;
  }, {} as Record<string, number>);

  const razas = Object.keys(estadisticasCantidad);
  const cantidadGanado = razas.map(raza => estadisticasCantidad[raza]);

  new Chart(ctxCantidadGanado, {
    type: 'bar',
    data: {
      labels: razas,
      datasets: [{
        label: 'Cantidad de Ganado por Raza',
        data: cantidadGanado,
        backgroundColor: 'rgba(153, 102, 255, 0.8)',  // Color de las barras
        borderColor: '#9966FF',  // Color de borde
        borderWidth: 1,
        borderRadius: 5,  // Bordes redondeados para las barras
        hoverBackgroundColor: 'rgba(153, 102, 255, 1)',  // Color al pasar el cursor
        hoverBorderColor: '#9966FF',
        barPercentage: 0.8,  // Establecer el ancho de las barras
      }]
    },
    options: {
      responsive: false,  // Desactivar la opción de responsividad
      plugins: { 
        legend: { display: false },  // Ocultar leyenda
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#000',
          bodyColor: '#333',
          borderColor: '#ccc',
          borderWidth: 1
        }
      },
      scales: {
        y: { 
          title: { display: true, text: 'Cantidad de Ganado' },
          beginAtZero: true,
          ticks: { 
            precision: 0,
            callback: function(value) { return (Number(value) || 0).toFixed(0); }
          },
          grid: {
            color: '#ddd'  // Líneas de la cuadrícula más suaves
          }
        },
        x: { 
          title: { display: true, text: 'Razas de Ganado' },
          grid: {
            display: false, // Quitar líneas en el eje X
          }
        }
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 500));  // Tiempo de espera para la generación de la imagen
  const cantidadGanadoImage = canvasCantidadGanado.toDataURL('image/png');

  // 📌 Verificar espacio y agregar nueva página si es necesario
  if (finalY + 90 > doc.internal.pageSize.height) {
    doc.addPage();
    finalY = 20; // Reiniciar en la nueva página
  }

  doc.addImage(cantidadGanadoImage, 'PNG', 20, finalY, 160, 80);  // Agregar la imagen al PDF
  finalY += 90;  // Aumentar el espacio para el siguiente gráfico
}

    // 📌 Verificar espacio para Firma y QR
    if (finalY + 50 > doc.internal.pageSize.height) {
      doc.addPage();
      finalY = 20;
    }

   // 📌 Firma y QR (posición ajustada)
const espacioExtra = 10; // Ajuste para bajarlo un poco más

doc.text('______________________', 14, finalY + espacioExtra);
doc.text('Firma del Responsable', 14, finalY + 10 + espacioExtra);

const qrData = `Inventario de Ganado\nFecha: ${fechaActual}\nTotal Cabezas: ${totalCabezas}\nCapital: $${capitalTotal}`;
const qrImage = await QRCode.toDataURL(qrData);
doc.addImage(qrImage, 'PNG', 14, finalY + 15 + espacioExtra, 30, 30);


    // 📌 Paginación
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, 180, doc.internal.pageSize.height - 10);
    }

    // 📌 Guardar PDF
    doc.save(`Inventario_Ganado_${fechaActual}.pdf`);
  }
}  