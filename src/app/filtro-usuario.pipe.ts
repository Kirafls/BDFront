import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroUsuario',
  standalone: true
})
export class FiltroUsuarioPipe implements PipeTransform {
  transform(usuarios: any[], termino: string): any[] {
    if (!usuarios || !termino) return usuarios;
    termino = termino.toLowerCase();
    return usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(termino) ||
      usuario.apellido.toLowerCase().includes(termino)
    );
  }
}
