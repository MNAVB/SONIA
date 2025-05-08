import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface VentaDelDia {
    id?: string;
    producto: string;
    precio: number;
    cantidad: number;
    comprador: string;
    celular: string;
    fecha: Date | Timestamp;
    estado: 'en_proceso' | 'vendido' | 'rechazado';
    pagoConfirmado: boolean;
}

@Injectable({ providedIn: 'root' })
export class VentasDelDiaService {
    private ventasDelDiaRef = collection(this.firestore, 'ventas-del-dia');

    constructor(private firestore: Firestore) {}

    getVentasDelDia(): Observable<VentaDelDia[]> {
        return collectionData(this.ventasDelDiaRef, { idField: 'id' }) as Observable<VentaDelDia[]>;
    }

    addVentaDelDia(venta: VentaDelDia) {
        if (!venta.producto || !venta.comprador || !venta.celular) {
            throw new Error('Datos incompletos para guardar la venta del día');
        }
        const ventaToSave = {
            ...venta,
            fecha: venta.fecha instanceof Date ? Timestamp.fromDate(venta.fecha) : venta.fecha
        };
        return addDoc(this.ventasDelDiaRef, ventaToSave);
    }

    updateVentaDelDia(id: string, venta: Partial<VentaDelDia>) {
        const ventaDoc = doc(this.firestore, `ventas-del-dia/${id}`);
        if (venta.fecha && venta.fecha instanceof Date) {
            venta = { ...venta, fecha: Timestamp.fromDate(venta.fecha) };
        }
        return updateDoc(ventaDoc, venta);
    }

    deleteVentaDelDia(id: string) {
        const ventaDoc = doc(this.firestore, `ventas-del-dia/${id}`);
        return deleteDoc(ventaDoc);
    }
}