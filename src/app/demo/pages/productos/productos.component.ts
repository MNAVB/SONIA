import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from 'src/app/theme/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, CardComponent, ReactiveFormsModule, MatDialogModule, MatIconModule, ConfirmDialogComponent],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent {
  productoForm: FormGroup;
  productos: any[] = [];
  editando: boolean = false;
  productoSeleccionado: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, Validators.required],
      categoria: [''],
      stock: [0, Validators.required],
      imagen: ['']
    });
  }

  guardarProducto() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    if (this.editando && this.productoSeleccionado !== null) {
      this.productos[this.productoSeleccionado] = this.productoForm.value;
      this.editando = false;
      this.productoSeleccionado = null;
    } else {
      this.productos.push(this.productoForm.value);
      this.productos = [...this.productos];
    }

    this.productoForm.reset();
  }

  editarProducto(index: number) {
    this.editando = true;
    this.productoSeleccionado = index;
    this.productoForm.patchValue(this.productos[index]);
  }

  eliminarProducto(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar producto',
        message: '¿Está seguro que desea eliminar este producto?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productos.splice(index, 1);
        this.productos = [...this.productos];
      }
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.productoSeleccionado = null;
    this.productoForm.reset();
  }
}