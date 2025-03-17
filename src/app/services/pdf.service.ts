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
  constructor() {}

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

    // 📌 Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventario de Ganado', 14, 15);

    // 📆 Fecha
    const fechaActual = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Fecha: ${fechaActual}`, 14, 25);

    // 📊 Estadísticas
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

   // 📊 Gráfico más grande y mejorado
const canvasCombo = document.createElement('canvas');
canvasCombo.width = 600;
canvasCombo.height = 300;
const ctxCombo = canvasCombo.getContext('2d');

if (ctxCombo) {
  const estadisticasRaza = ganado.reduce((acc, vaca) => {
    if (!acc[vaca.raza]) {
      acc[vaca.raza] = { cantidad: 0, totalPeso: 0, totalValor: 0 };
    }
    acc[vaca.raza].cantidad += 1;
    acc[vaca.raza].totalPeso += vaca.peso;
    acc[vaca.raza].totalValor += vaca.peso * vaca.precioPorKilo;
    return acc;
  }, {});

  const razas = Object.keys(estadisticasRaza);
  const cantidadGanado = razas.map(raza => estadisticasRaza[raza].cantidad);
  const pesoPromedio = razas.map(raza => estadisticasRaza[raza].totalPeso / estadisticasRaza[raza].cantidad);
  const valorTotal = razas.map(raza => estadisticasRaza[raza].totalValor);

  new Chart(ctxCombo, {
    type: 'bar',
    data: {
      labels: razas,
      datasets: [
        {
          type: 'bar',
          label: 'Cantidad de ganado',
          data: cantidadGanado,
          backgroundColor: 'rgba(255, 87, 51, 0.8)', // Naranja más suave
          borderColor: '#C70039',
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          type: 'line',
          label: 'Peso promedio (kg)',
          data: pesoPromedio,
          borderColor: '#33FF57', // Verde brillante
          backgroundColor: 'rgba(51, 255, 87, 0.2)',
          fill: true,
          tension: 0.4,
          pointStyle: 'circle',
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: 'y2',
        },
        {
          type: 'line',
          label: 'Valor total ($)',
          data: valorTotal,
          borderColor: '#3357FF', // Azul brillante
          backgroundColor: 'rgba(51, 87, 255, 0.2)',
          fill: true,
          tension: 0.4,
          borderDash: [5, 5], // Línea punteada para diferenciar
          pointStyle: 'rect',
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: 'y2',
        }
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: true, position: 'top' },
      },
      scales: {
        y1: { 
          type: 'linear', 
          position: 'left', 
          title: { display: true, text: 'Cantidad de ganado' },
          grid: { drawOnChartArea: false },
          ticks: { stepSize: 1, precision: 0 }, // ✅ Solo números enteros
        },
        y2: { 
          type: 'linear', 
          position: 'right', 
          title: { display: true, text: 'Peso (kg) / Valor ($)' }
        },      
        x: {
          title: { display: true, text: 'Razas de ganado' },
        },
      },
    },
  });

  await new Promise(resolve => setTimeout(resolve, 500));
  const comboImage = canvasCombo.toDataURL('image/png');
  doc.addImage(comboImage, 'PNG', 20, finalY, 160, 80);
}

finalY += 110;

    
    // 📌 Firma y QR
    doc.text('______________________', 14, finalY);
    doc.text('Firma del Responsable', 14, finalY + 10);

    const qrData = `Inventario de Ganado\nFecha: ${fechaActual}\nTotal Cabezas: ${totalCabezas}\nCapital: $${capitalTotal}`;
    const qrImage = await QRCode.toDataURL(qrData);
    doc.addImage(qrImage, 'PNG', 14, finalY + 15, 30, 30);

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
