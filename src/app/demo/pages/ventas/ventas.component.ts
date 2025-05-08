import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentasService, Venta } from 'src/app/core/services/pages-service/ventas.service';
import { ProductosService, Producto } from 'src/app/core/services/pages-service/productos.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/theme/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, CardComponent, ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  ventaForm: FormGroup;
  ventas: Venta[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  editando = false;
  ventaEditandoId: string | null = null;

  constructor(
      private fb: FormBuilder,
      private ventasService: VentasService,
      private productosService: ProductosService,
      private dialog: MatDialog // <-- aquí
  ){
    this.ventaForm = this.fb.group({
      producto: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
      cantidad: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.ventasService.getVentas().subscribe(ventas => {
      this.ventas = ventas;
    });
    this.productosService.getProductos().subscribe(productos => {
      this.productos = productos;
      this.productosFiltrados = productos;
    });

    this.ventaForm.get('producto')?.valueChanges.subscribe(() => {
      this.filtrarProductos();
    });
  }

  filtrarProductos() {
    const valor = this.ventaForm.get('producto')?.value?.toLowerCase() || '';
    this.productosFiltrados = this.productos.filter(prod =>
        prod.categoria?.toLowerCase().includes(valor)
    );
  }

  seleccionarProducto(categoria: string) {
    this.ventaForm.get('producto')?.setValue(categoria);
  }
  guardarVenta() {
    if (this.ventaForm.invalid) {
      this.ventaForm.markAllAsTouched();
      return;
    }
    const venta: Venta = {
      ...this.ventaForm.value,
      cantidad: Number(this.ventaForm.value.cantidad),
      precio: Number(this.ventaForm.value.precio)
    };
    const producto = this.productos.find(p => p.categoria === venta.producto);
    if (!producto) return;

    if (!this.editando && venta.cantidad > producto.stock) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Stock insuficiente',
          message: `La cantidad vendida (${venta.cantidad}) supera el stock disponible (${producto.stock}).`
        }
      });
      return;
    }
    if (!this.editando && venta.cantidad > producto.stock) {
      // Aquí puedes mostrar un mensaje de error con tu sistema de alertas o un simple alert
      alert('La cantidad vendida no puede ser mayor al stock disponible.');
      return;
    }
    if (this.editando && this.ventaEditandoId) {
      this.ventasService.updateVenta(this.ventaEditandoId, venta).then(() => this.cancelarEdicion());
    } else {
      this.ventasService.addVenta(venta).then(() => {
        const nuevoStock = producto.stock - venta.cantidad;
        this.productosService.updateProducto(producto.id, { ...producto, stock: nuevoStock });
        this.ventaForm.reset();
      });
    }
  }

  limpiarFormulario() {
    this.ventaForm.reset();
  }

  editarVenta(venta: Venta) {
    this.editando = true;
    this.ventaEditandoId = venta.id || null;
    this.ventaForm.patchValue(venta);
  }

  cancelarEdicion() {
    this.editando = false;
    this.ventaEditandoId = null;
    this.ventaForm.reset();
  }

  eliminarVenta(venta: Venta) {
    if (venta.id) {
      this.ventasService.deleteVenta(venta.id).then(() => {
        const cantidad = Number(venta.cantidad); // Asegura que sea número
        const producto = this.productos.find(p => p.categoria === venta.producto);
        if (producto && producto.id) {
          const nuevoStock = producto.stock + cantidad;
          this.productosService.updateProducto(producto.id, { ...producto, stock: nuevoStock });
        }
      });
    }
  }
}