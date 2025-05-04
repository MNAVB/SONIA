import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from 'src/app/theme/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, CardComponent, ReactiveFormsModule, MatDialogModule, MatIconModule, ConfirmDialogComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent {
  categoriaForm: FormGroup;
  categorias: any[] = [];
  editando: boolean = false;
  categoriaSeleccionada: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      codigo: ['']
    });
  }

  guardarCategoria() {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    if (this.editando && this.categoriaSeleccionada !== null) {
      this.categorias[this.categoriaSeleccionada] = this.categoriaForm.value;
      this.editando = false;
      this.categoriaSeleccionada = null;
    } else {
      this.categorias.push(this.categoriaForm.value);
    }

    this.categoriaForm.reset();
  }

  editarCategoria(index: number) {
    this.editando = true;
    this.categoriaSeleccionada = index;
    this.categoriaForm.patchValue(this.categorias[index]);
  }

  eliminarCategoria(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar categoría',
        message: '¿Está seguro que desea eliminar esta categoría?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categorias.splice(index, 1);
      }
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.categoriaSeleccionada = null;
    this.categoriaForm.reset();
  }
}