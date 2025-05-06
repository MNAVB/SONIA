// src/app/core/services/pages-service/categoria.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Categoria {
    id?: string;
    nombre: string;
    descripcion?: string;
    codigo?: string;
    orden?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    constructor(private firestore: Firestore) {}

    getCategorias(): Observable<Categoria[]> {
        const categoriasRef = collection(this.firestore, 'categorias');
        return collectionData(categoriasRef, { idField: 'id' }) as Observable<Categoria[]>;
    }

    addCategoria(categoria: Categoria) {
        const categoriasRef = collection(this.firestore, 'categorias');
        return addDoc(categoriasRef, categoria);
    }

    updateCategoria(id: string, categoria: Categoria) {
        const categoriaDoc = doc(this.firestore, `categorias/${id}`);
        return updateDoc(categoriaDoc, { ...categoria });
    }

    deleteCategoria(id: string) {
        const categoriaDoc = doc(this.firestore, `categorias/${id}`);
        return deleteDoc(categoriaDoc);
    }
}