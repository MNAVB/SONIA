import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService, Producto } from 'src/app/core/services/pages-service/productos.service';
import { CategoriaService, Categoria } from 'src/app/core/services/pages-service/categoria.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, MatAutocompleteModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productoForm: FormGroup;
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  editando: boolean = false;
  productoEditandoId: string | null = null;

  constructor(
      private fb: FormBuilder,
      private productosService: ProductosService,
      private categoriaService: CategoriaService
  ) {
    this.productoForm = this.fb.group({
      categoria: ['', Validators.required],
      stock: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.productosService.getProductos().subscribe(productos => {
      this.productos = productos;
    });
    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
      this.categoriasFiltradas = categorias;
    });

    this.productoForm.get('categoria')?.valueChanges.subscribe(() => {
      this.filtrarCategorias();
    });
  }

  filtrarCategorias() {
    const valor = this.productoForm.get('categoria')?.value?.toLowerCase() || '';
    this.categoriasFiltradas = this.categorias.filter(cat =>
        cat.nombre.toLowerCase().includes(valor)
    );
  }

  seleccionarCategoria(nombre: string) {
    this.productoForm.get('categoria')?.setValue(nombre);
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
  limpiarFormulario() {
    this.productoForm.reset();
  }

  editarProducto(producto: Producto) {
    this.editando = true;
    this.productoEditandoId = producto.id || null;
    this.productoForm.patchValue({
      categoria: producto.categoria,
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