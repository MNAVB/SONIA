import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { VentasDelDiaService, VentaDelDia } from 'src/app/core/services/pages-service/ventas-del-dia.service';
import { VentasService, Venta } from 'src/app/core/services/pages-service/ventas.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/theme/shared/confirm-dialog/confirm-dialog.component';
import { ProductosService } from 'src/app/core/services/pages-service/productos.service';

@Component({
    selector: 'app-ventas-del-dia',
    standalone: true,
    imports: [CommonModule, CardComponent, ReactiveFormsModule],
    templateUrl: './ventas-del-dia.component.html',
    styleUrls: ['./ventas-del-dia.component.scss']
})
export class VentasDelDiaComponent implements OnInit {
    ventasPreparadas: Venta[] = [];
    ventasForm: FormArray<FormGroup> = this.fb.array<FormGroup>([]);
    mostrarVentas = false;
    ventasDelDiaGuardadas: VentaDelDia[] = [];
    ventasCargadas = false;

    constructor(
        private fb: FormBuilder,
        private ventasService: VentasService,
        private ventasDelDiaService: VentasDelDiaService,
        private productosService: ProductosService, // <-- agrega esto
        private dialog: MatDialog
    ) {}

    editandoVentaId: string | null = null;
    formEdicion: FormGroup | null = null;

    ngOnInit(): void {
        this.cargarVentasDelDiaGuardadas();
    }


    listarVentas() {
        if (this.ventasCargadas) {
            this.mostrarVentas = true;
            return;
        }
        this.ventasService.getVentas().subscribe(ventas => {
            this.ventasPreparadas = ventas;
            this.ventasForm.clear();
            ventas.forEach(venta => {
                this.ventasForm.push(this.fb.group({
                    producto: [{ value: venta.producto, disabled: true }],
                    precio: [{ value: venta.precio, disabled: true }],
                    cantidad: [{ value: venta.cantidad, disabled: true }],
                    comprador: ['', Validators.required],
                    celular: ['', Validators.required],
                    estado: ['en_proceso', Validators.required],
                    pagoConfirmado: [false]
                }));
            });
            this.mostrarVentas = true;
            this.ventasCargadas = true;
        });
    }

    guardarVentaDelDia(idx: number) {
        const form = this.ventasForm.at(idx) as FormGroup;
        if (form.invalid) {
            form.markAllAsTouched();
            return;
        }
        const base = this.ventasPreparadas[idx];
        const valores = form.getRawValue();

        // 1. Guarda en ventas del día
        this.ventasDelDiaService.addVentaDelDia({
            producto: base.producto,
            precio: base.precio,
            cantidad: base.cantidad,
            comprador: valores.comprador,
            celular: valores.celular,
            estado: valores.estado,
            pagoConfirmado: valores.pagoConfirmado,
            fecha: new Date()
        }).then(() => {
            // 2. Elimina de la colección ventas
            if (base.id) {
                this.ventasService.deleteVenta(base.id).then(() => {
                    // 3. Actualiza el stock del producto
                    // Aquí debes tener acceso al servicio de productos
                    // Supongamos que tienes productosService inyectado
                    // Busca el producto y descuenta el stock
                    this.productosService.getProductos().subscribe(productos => {
                        const producto = productos.find(p => p.categoria === base.producto);
                        if (producto && producto.id) {
                            const nuevoStock = producto.stock - base.cantidad;
                            this.productosService.updateProducto(producto.id, { ...producto, stock: nuevoStock });
                        }
                    }).unsubscribe();
                });
            }
            // 4. Elimina de la lista local
            this.ventasPreparadas.splice(idx, 1);
            this.ventasForm.removeAt(idx);
            this.cargarVentasDelDiaGuardadas();
        });
    }


    cargarVentasDelDiaGuardadas() {
        this.ventasDelDiaService.getVentasDelDia().subscribe(ventas => {
            this.ventasDelDiaGuardadas = ventas;
        });
    }

    eliminarVentaDelDia(id: string | undefined) {
        if (!id) return;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Eliminar venta',
                message: '¿Seguro que deseas eliminar esta venta del día?'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.ventasDelDiaService.deleteVentaDelDia(id).then(() => {
                    this.cargarVentasDelDiaGuardadas();
                });
            }
        });
    }

    editarVentaDelDia(venta: VentaDelDia) {
        this.editandoVentaId = venta.id || null;
        this.formEdicion = this.fb.group({
            comprador: [venta.comprador, Validators.required],
            celular: [venta.celular, Validators.required],
            estado: [venta.estado, Validators.required],
            pagoConfirmado: [venta.pagoConfirmado]
        });
    }
    guardarEdicionVentaDelDia(id: string) {
        if (!this.formEdicion || this.formEdicion.invalid) return;
        this.ventasDelDiaService.updateVentaDelDia(id, this.formEdicion.value).then(() => {
            this.editandoVentaId = null;
            this.formEdicion = null;
            this.cargarVentasDelDiaGuardadas();
        });
    }

    cancelarEdicion() {
        this.editandoVentaId = null;
        this.formEdicion = null;
    }
}