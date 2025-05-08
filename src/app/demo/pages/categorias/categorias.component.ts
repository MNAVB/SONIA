import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService, Categoria } from 'src/app/core/services/pages-service/categoria.service';
import { CardComponent } from '../../../theme/shared/components/card/card.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  categoriaForm: FormGroup;
  categoriasArray: Categoria[] = [];
  editando: boolean = false;
  categoriaEditandoId: string | null = null;

  constructor(
      private fb: FormBuilder,
      private categoriaService: CategoriaService
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categoriasArray = categorias;
    });
  }

  private obtenerSiguienteCodigo(): string {
    const codigos = this.categoriasArray
        .map(cat => Number(cat.codigo))
        .filter(num => !isNaN(num) && num >= 1 && num <= 1000);
    const maxCodigo = codigos.length > 0 ? Math.max(...codigos) : 0;
    const siguiente = Math.min(maxCodigo + 1, 1000);
    return siguiente.toString().padStart(4, '0');
  }

  guardarCategoria() {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }
    const categoria: Categoria = this.categoriaForm.value;
    if (!this.editando) {
      categoria.codigo = this.obtenerSiguienteCodigo();
    }
    if (this.editando && this.categoriaEditandoId) {
      this.categoriaService.updateCategoria(this.categoriaEditandoId, categoria).then(() => {
        this.cancelarEdicion();
      });
    } else {
      this.categoriaService.addCategoria(categoria).then(() => {
        this.categoriaForm.reset();
      });
    }
  }
  limpiarFormulario() {
    this.categoriaForm.reset();
  }

  editarCategoria(categoria: Categoria) {
    this.editando = true;
    this.categoriaEditandoId = categoria.id || null;
    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.categoriaEditandoId = null;
    this.categoriaForm.reset();
  }

  eliminarCategoria(categoria: Categoria) {
    if (categoria.id) {
      this.categoriaService.deleteCategoria(categoria.id);
    }
  }
}