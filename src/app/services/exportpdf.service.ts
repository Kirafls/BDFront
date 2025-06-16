import { Injectable } from '@angular/core';

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
     constructor() {
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
}
