import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Venta {
    id?: string;
    producto: string;
    precio: number;
    cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class VentasService {
    private ventasRef = collection(this.firestore, 'ventas');

    constructor(private firestore: Firestore) {}

    getVentas(): Observable<Venta[]> {
        return collectionData(this.ventasRef, { idField: 'id' }) as Observable<Venta[]>;
    }

    addVenta(venta: Venta) {
        return addDoc(this.ventasRef, venta);
    }

    updateVenta(id: string, venta: Venta) {
        const ventaDoc = doc(this.firestore, `ventas/${id}`);
        return updateDoc(ventaDoc, venta as any);
    }

    deleteVenta(id: string) {
        const ventaDoc = doc(this.firestore, `ventas/${id}`);
        return deleteDoc(ventaDoc);
    }
}