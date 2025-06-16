import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-reportes-ventas',
  templateUrl: './reportes-ventas.component.html',
  styleUrls: ['./reportes-ventas.component.css']
})
export class ReportesVentasComponent implements OnInit {
  
  // Propiedades para el PDF
  pdfVisible = false;
  pdfSrc: string = '';
  pdfSrcSanitized: SafeResourceUrl | null = null;
  
  // Datos de ventas y reportes
  ventas: any[] = [];
  reportes: any[] = [];
  
  // Estados de carga
  cargando = false;
  error = '';

  constructor(
    private productosService: ProductosService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarReporte();
    this.cargarVentas();
  }

  cargarReporte() {
    this.cargando = true;
    this.error = '';
    
    this.productosService.getReporteVentas().subscribe({
      next: (data) => {
        this.reportes = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los reportes';
        this.cargando = false;
        console.error('Error cargando reportes:', err);
      }
    });
  }

  cargarVentas() {
    this.productosService.getVentasReporte().subscribe({
      next: (data) => {
        this.ventas = data;
        console.log('Ventas cargadas:', this.ventas);
      },
      error: (err) => {
        console.error('Error cargando reporte de ventas:', err);
        this.error = 'Error al cargar las ventas';
      }
    });
  }

  abrirPDF(venta: any) {
    try {
      console.log('Intentando abrir PDF para venta:', venta);
      
      // Opción 1: Crear URL del PDF de manera simple
      const pdfUrl = `http://localhost/mi_api/api/generar-pdf.php?factura=${venta.Id_factura}`;

      // Abrir en nueva ventana (más confiable)
      window.open(pdfUrl, '_blank', 'width=800,height=600');
      
      // Opción 2: Si quieres mostrar en modal (descomenta las líneas de abajo)
      /*
      this.pdfSrc = pdfUrl;
      this.pdfSrcSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      this.pdfVisible = true;
      */
      
    } catch (error) {
      console.error('Error abriendo PDF:', error);
      this.error = 'Error al abrir el PDF';
      alert('Error al abrir el PDF. Revisa la consola para más detalles.');
    }
  }

  cerrarPDF() {
    this.pdfVisible = false;
    this.pdfSrc = '';
    this.pdfSrcSanitized = null;
  }

  // Método para generar PDF si es necesario
  generarPDF(venta: any) {
    this.productosService.generarPDFFactura(venta.Id_factura).subscribe({
      next: (response) => {
        // Si el servicio devuelve un blob
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        this.pdfSrc = url;
        this.pdfSrcSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.pdfVisible = true;
      },
      error: (err) => {
        console.error('Error generando PDF:', err);
        this.error = 'Error al generar el PDF';
      }
    });
  }

  // Método para descargar PDF
  descargarPDF(venta: any) {
    try {
      const link = document.createElement('a');
      link.href = `http://localhost/mi_api/api/generar-pdf.php?factura=${venta.Id_factura}&download=1`;
      link.download = `factura_${venta.Id_factura}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al descargar el PDF');
    }
  }
}