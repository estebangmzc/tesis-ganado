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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ganado');

    const title = worksheet.addRow(['📜 Inventario de Ganado 📜']);
    title.font = { bold: true, size: 16, color: { argb: 'FAEBD7' } };
    title.alignment = { horizontal: 'center' };

    const lastColumn = 'H';
    worksheet.mergeCells(`A1:${lastColumn}1`);

    const mergedCell = worksheet.getCell('A1');
    mergedCell.fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8B4513' }
    };

    const headers = [
      'Raza', 'Sexo', 'Edad', 'Peso (kg)', 'Precio por Kilo', 'Total Precio', 'Estado de Salud', 'Propósito'
    ];
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: '5C4033' } };
      cell.fill = { 
        type: 'pattern', 
        pattern: 'solid', 
        fgColor: { argb: 'D2B48C' }
      };
      cell.alignment = { horizontal: 'center' };
    });

    data.forEach(({ id, ...vaca }, index) => {
      const row = worksheet.addRow([
        vaca.raza, vaca.sexo, vaca.edad, vaca.peso, vaca.precioPorKilo, 
        vaca.totalPrecio, vaca.estadoSalud, vaca.proposito
      ]);

      row.eachCell((cell) => {
        cell.fill = { 
          type: 'pattern', 
          pattern: 'solid', 
          fgColor: { argb: index % 2 === 0 ? 'FAF0E6' : 'FFFFFF' } // Crema y blanco
        };
      });
    });

    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  }
}
