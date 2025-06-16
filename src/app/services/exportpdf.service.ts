import { Injectable } from '@angular/core';
import { SreportesService } from './sreportes.service';

declare var jsPDF: any;

declare global {
  interface Window {
    jsPDF: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ExportpdfService {
     constructor( private reportesService: SreportesService) {
    this.cargarLibrerias();
  }

  private cargarLibrerias(): void {
    // Carga jsPDF solo si no está disponible
    if (typeof jsPDF === 'undefined') {
      import('jspdf').then((jsPDFModule) => {
        window['jsPDF'] = jsPDFModule.default;
        return import('jspdf-autotable');
      }).catch(error => {
        console.error('Error al cargar librerías PDF:', error);
      });
    }
  }


  async exportarAPDF(datos: any[], encabezados: string[], titulo: string, nombreArchivo: string): Promise<void> {
    try {
      // Carga dinámica asegura que jsPDF esté disponible
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();

      // Configuración del documento
      doc.setFont('helvetica');
      doc.setFontSize(16);
      doc.text(titulo, 14, 15);

      // Generar tabla
      (doc as any).autoTable({
        head: [encabezados],
        body: datos,
        startY: 20,
        theme: 'grid',
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        }
      });

      // Guardar documento
      doc.save(`${nombreArchivo}_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw new Error('No se pudo generar el documento PDF');
    }
  }
   async generarReporteVentas(): Promise<void> {
    try {
      // 1. Obtener datos de ventas con validación de tipos
      const ventas = await this.reportesService.getAllVentasConDetalles().toPromise();
      
      if (!ventas || ventas.length === 0) {
        throw new Error('No hay ventas para generar el reporte');
      }

      // 2. Cargar librerías PDF
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();

      // 3. Configuración inicial
      doc.setFont('helvetica');
      doc.setFontSize(16);
      doc.text('Reporte de Ventas', 14, 15);
      doc.setFontSize(12);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 25);

      // 4. Preparar datos con conversión segura de tipos
      const encabezados = ['ID Venta', 'Fecha', 'Total', 'Método Pago', 'Productos'];
      const datos = ventas.map(venta => {
        // Convertir total a número si es string
        const total = typeof venta.total === 'string' 
          ? parseFloat(venta.total) 
          : Number(venta.total);
          
        return [
          venta.id_venta,
          new Date(venta.fecha).toLocaleDateString(),
          `$${total.toFixed(2)}`, // Ahora seguro que es número
          venta.metodo_pago,
          venta.detalles?.map((d: { nombre_producto: string }) => d.nombre_producto).join(', ') || 'Sin productos'
        ];
      });

      // 5. Generar tabla principal
      (doc as any).autoTable({
        head: [encabezados],
        body: datos,
        startY: 35,
        theme: 'grid',
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          2: { cellWidth: 20 }, // Columna Total
          4: { cellWidth: 60 }  // Columna Productos
        }
      });

      // 6. Guardar documento
      doc.save(`reporte_ventas_${new Date().toISOString().slice(0,10)}.pdf`);

    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw new Error(typeof error === 'string' ? error : 'Error al generar el reporte');
    }
  }
}
