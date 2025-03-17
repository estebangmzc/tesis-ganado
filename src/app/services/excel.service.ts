import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() {}

  async exportToExcel(data: any[], fileName: string): Promise<void> {
    if (!data || data.length === 0) {
      console.warn("⚠️ No hay datos para exportar.");
      return;
    }

    // **📌 Crear libro y hoja de trabajo**
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ganado');

    // **🔹 Establecer título elegante 🔹**
    const title = worksheet.addRow(['📜 Inventario de Ganado 📜']);
    title.font = { bold: true, size: 16, color: { argb: 'FAEBD7' } }; // Beige claro
    title.alignment = { horizontal: 'center' };

    // **💡 Fusionar celdas solo hasta la última columna de datos**
    const lastColumn = 'H'; // "H" es la última columna (Propósito)
    worksheet.mergeCells(`A1:${lastColumn}1`);

    // **🎨 Aplicar color de fondo solo al título**
    const mergedCell = worksheet.getCell('A1');
    mergedCell.fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8B4513' } // Marrón oscuro (SaddleBrown)
    };

    // **📌 Definir encabezados con estilo beige**
    const headers = [
      'Raza', 'Sexo', 'Edad', 'Peso (kg)', 'Precio por Kilo', 'Total Precio', 'Estado de Salud', 'Propósito'
    ];
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: '5C4033' } }; // Marrón oscuro (más suave)
      cell.fill = { 
        type: 'pattern', 
        pattern: 'solid', 
        fgColor: { argb: 'D2B48C' } // Beige claro (Tan)
      };
      cell.alignment = { horizontal: 'center' };
    });

    // **📌 Agregar los datos transformados con colores alternos**
    data.forEach(({ id, ...vaca }, index) => {
      const row = worksheet.addRow([
        vaca.raza, vaca.sexo, vaca.edad, vaca.peso, vaca.precioPorKilo, 
        vaca.totalPrecio, vaca.estadoSalud, vaca.proposito
      ]);

      // Alternar colores en las filas para mejor legibilidad
      row.eachCell((cell) => {
        cell.fill = { 
          type: 'pattern', 
          pattern: 'solid', 
          fgColor: { argb: index % 2 === 0 ? 'FAF0E6' : 'FFFFFF' } // Crema y blanco
        };
      });
    });

    // **🖥️ Ajustar el tamaño de las columnas automáticamente**
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    // **📌 Guardar archivo**
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  }
}
