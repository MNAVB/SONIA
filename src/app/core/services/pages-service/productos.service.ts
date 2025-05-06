// src/app/core/services/pages-service/productos.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Producto {
    id?: string;
    categoria: string;
    imagen?: string;
    stock: number;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
    constructor(private firestore: Firestore) {}

    getProductos(): Observable<Producto[]> {
        const productosRef = collection(this.firestore, 'productos');
        return collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>;
    }

    addProducto(producto: Producto) {
        const productosRef = collection(this.firestore, 'productos');
        return addDoc(productosRef, producto);
    }

    updateProducto(id: string, producto: Producto) {
        const productoDoc = doc(this.firestore, `productos/${id}`);
        return updateDoc(productoDoc, { ...producto });
    }

    deleteProducto(id: string) {
        const productoDoc = doc(this.firestore, `productos/${id}`);
        return deleteDoc(productoDoc);
    }
}