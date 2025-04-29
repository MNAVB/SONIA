import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    template: `
    <h1>Bienvenidos a SONIA</h1>

    <div *ngIf="productos.length > 0; else cargando">
      <h2>Productos disponibles</h2>
      <ul>
        <li *ngFor="let producto of productos">
          {{ producto.nombre }} - {{ producto.fecha_creacion }}  - {{ producto.creador }} - S/.{{ producto.precio }} (Stock: {{ producto.stock || '0' }})
        </li>
      </ul>
    </div>

    <ng-template #cargando>
      <p>Cargando productos...</p>
    </ng-template>
  `
})
export class AppComponent implements OnInit {
    firestore = inject(Firestore);
    productos: any[] = [];

    async ngOnInit() {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, 'productos'));
            this.productos = querySnapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error al obtener productos de Firestore:', error);
        }
    }
}
