// src/app/services/pedido.service.ts
import { Injectable } from '@angular/core';
import { collectionData, Firestore, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {
    constructor(private firestore: Firestore) {}

    getPedidos(): Observable<any[]> {
        const pedidosRef = collection(this.firestore, 'pedido');
        return collectionData(pedidosRef, { idField: 'id' });
    }
}