import { Component } from '@angular/core';
import { ExportpdfService } from 'src/app/services/exportpdf.service';
import { SreportesService } from 'src/app/services/sreportes.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
// Tipos definidos antes de la clase


export class ReporteComponent {
    // Datos y estado del componente
  reporteVentas = {
    ventasPorDia: [] as any[],
    productosMasVendidos: [] as any[],
    cargando: true,
    error: ''
  };

  // Filtros para las fechas
  filtros = {
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(
    private reportesService: SreportesService,
    private pdfService: ExportpdfService
  ) { }

  ngOnInit(): void {
    this.cargarReportes();
  }

  /**
   * Carga los reportes desde el servidor
   */
  cargarReportes(): void {
    this.reporteVentas.cargando = true;
    this.reporteVentas.error = '';

    // Cargar ventas por día
    this.reportesService.getventasxdia().subscribe({
      next: (datos) => {
        this.reporteVentas.ventasPorDia = this.procesarDatosVentas(datos);
        this.verificarCarga();
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
        this.reporteVentas.error = 'Error al cargar ventas por día';
        this.reporteVentas.cargando = false;
      }
    });

    // Cargar productos más vendidos
    this.reportesService.getproductosmasvendidos().subscribe({
      next: (datos) => {
        this.reporteVentas.productosMasVendidos = this.procesarDatosProductos(datos);
        this.verificarCarga();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.reporteVentas.error = 'Error al cargar productos más vendidos';
        this.reporteVentas.cargando = false;
      }
    });
  }

  /**
   * Procesa los datos de ventas para asegurar formato correcto
   */
  private procesarDatosVentas(datos: any[]): any[] {
    return datos.map(item => ({
      fecha: this.formatearFecha(item.fecha),
      total_dia: parseFloat(item.total_dia) || 0,
      cantidad_ventas: parseInt(item.cantidad_ventas) || 0
    }));
  }

  /**
   * Procesa los datos de productos para asegurar formato correcto
   */
  private procesarDatosProductos(datos: any[]): any[] {
    return datos.map(item => ({
      id_producto: parseInt(item.id_producto) || 0,
      nombre: item.nombre || 'Producto sin nombre',
      total_vendido: parseInt(item.total_vendido) || 0,
      ingresos_totales: parseFloat(item.ingresos_totales) || 0,
      veces_vendido: parseInt(item.veces_vendido) || 0
    }));
  }

  /**
   * Formatea la fecha para el pipe Date
   */
  private formatearFecha(fechaString: string): string {
    // Convierte formato "16/6/2025" a "2025-06-16"
    const partes = fechaString.split('/');
    if (partes.length === 3) {
      const dia = partes[0].padStart(2, '0');
      const mes = partes[1].padStart(2, '0');
      const año = partes[2];
      return `${año}-${mes}-${dia}`;
    }
    return fechaString;
  }

  /**
   * Verifica si terminó la carga de todos los datos
   */
  verificarCarga(): void {
    if (this.reporteVentas.ventasPorDia.length > 0 && 
        this.reporteVentas.productosMasVendidos.length > 0) {
      this.reporteVentas.cargando = false;
    }
  }

  /**
   * Aplica los filtros seleccionados
   */
  aplicarFiltros(): void {
    console.log('Aplicando filtros:', this.filtros);
    this.cargarReportes();
  }

  /**
   * Genera reportes en PDF
   * @param tipo Tipo de reporte a generar
   */
 async generarReportePdf(tipo: string): Promise<void> {
  try {
    let encabezados: string[] = [];
    let datos: any[] = [];
    let titulo = '';

    if (tipo === 'ventas') {
      encabezados = ['Fecha', 'Total', 'Ventas'];
      datos = this.reporteVentas.ventasPorDia.map(v => [
        v.fecha, 
        `$${v.total_dia.toFixed(2)}`, 
        v.cantidad_ventas
      ]);
      titulo = 'Reporte de Ventas por Día';
    } else {
      encabezados = ['ID', 'Producto', 'Cantidad', 'Ingresos', 'Ventas'];
      datos = this.reporteVentas.productosMasVendidos.map(p => [
        p.id_producto,
        p.nombre,
        p.total_vendido,
        `$${p.ingresos_totales.toFixed(2)}`,
        p.veces_vendido
      ]);
      titulo = 'Productos Más Vendidos';
    }

    await this.pdfService.exportarAPDF(datos, encabezados, titulo, `reporte_${tipo}`);
  } catch (error) {
    console.error('Error:', error);
    this.reporteVentas.error = 'Error al generar el PDF. Intente nuevamente.';
  }
}

  /**
   * Genera un reporte completo con ambas tablas
   */
  /*private generarReporteCompleto(): void {
    const doc = this.pdfService.crearNuevoDocumento();
    let yPos = 20;
    
    // Título principal
    doc.setFontSize(18);
    doc.text('Reporte Completo de Ventas', 105, yPos, { align: 'center' });
    yPos += 25;
    
    // Ventas por día
    doc.setFontSize(14);
    doc.text('Ventas por Día', 14, yPos);
    yPos += 10;
    
    const ventasHeaders = ['Fecha', 'Total', 'Ventas'];
    const ventasData = this.reporteVentas.ventasPorDia.map(v => [
      v.fecha,
      `$${v.total_dia.toFixed(2)}`,
      v.cantidad_ventas.toString()
    ]);
    
    doc.autoTable({
      head: [ventasHeaders],
      body: ventasData,
      startY: yPos,
      margin: { horizontal: 14 },
      styles: { fontSize: 10 }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Productos más vendidos
    doc.setFontSize(14);
    doc.text('Productos Más Vendidos', 14, yPos);
    yPos += 10;
    
    const productosHeaders = ['ID', 'Producto', 'Cantidad', 'Ingresos', 'Ventas'];
    const productosData = this.reporteVentas.productosMasVendidos.map(p => [
      p.id_producto.toString(),
      p.nombre,
      p.total_vendido.toString(),
      `$${p.ingresos_totales.toFixed(2)}`,
      p.veces_vendido.toString()
    ]);
    
    doc.autoTable({
      head: [productosHeaders],
      body: productosData,
      startY: yPos,
      margin: { horizontal: 14 },
      styles: { fontSize: 10 }
    });
    
    // Guardar el documento
    doc.save(`reporte_completo_${new Date().toISOString().slice(0,10)}.pdf`);
  //}

  /**
   * Calcula el total de ventas
   */
  get totalVentas(): number {
    return this.reporteVentas.ventasPorDia.reduce((sum, v) => sum + v.total_dia, 0);
  }

  /**
   * Calcula el total de transacciones
   */
  get totalTransacciones(): number {
    return this.reporteVentas.ventasPorDia.reduce((sum, v) => sum + v.cantidad_ventas, 0);
  }

}
