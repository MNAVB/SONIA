import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService, Producto } from 'src/app/core/services/pages-service/productos.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productoForm: FormGroup;
  productos: Producto[] = [];
  editando: boolean = false;
  productoEditandoId: string | null = null;

  constructor(
      private fb: FormBuilder,
      private productosService: ProductosService
  ) {
    this.productoForm = this.fb.group({
      categoria: ['', Validators.required],
      imagen: [''],
      stock: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.productosService.getProductos().subscribe(productos => {
      this.productos = productos;
    });
  }

  guardarProducto() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }
    const producto: Producto = this.productoForm.value;
    if (this.editando && this.productoEditandoId) {
      this.productosService.updateProducto(this.productoEditandoId, producto).then(() => {
        this.cancelarEdicion();
      });
    } else {
      this.productosService.addProducto(producto).then(() => {
        this.productoForm.reset();
      });
    }
  }

  editarProducto(producto: Producto) {
    this.editando = true;
    this.productoEditandoId = producto.id || null;
    this.productoForm.patchValue({
      categoria: producto.categoria,
      imagen: producto.imagen,
      stock: producto.stock
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.productoEditandoId = null;
    this.productoForm.reset();
  }

  eliminarProducto(producto: Producto) {
    if (producto.id) {
      this.productosService.deleteProducto(producto.id);
    }
  }
}