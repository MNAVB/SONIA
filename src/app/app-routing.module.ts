// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';

const routes: Routes = [
    {
        // Ruta raíz redirige a login
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        // Layout para páginas que requieren autenticación
        path: '',
        component: AdminComponent,
// ...
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
            },
            {
                path: 'categorias',
                loadComponent: () => import('./demo/pages/categorias/categorias.component').then((c) => c.CategoriasComponent)
            },
            {
                path: 'productos',
                loadComponent: () => import('./demo/pages/productos/productos.component').then((c) => c.ProductosComponent)
            },
            {
                path: 'ventas',
                loadComponent: () => import('./demo/pages/ventas/ventas.component').then((c) => c.VentasComponent)
            }, // <-- Agrega la coma aquí
            {
                path: 'ventas-del-dia',
                loadComponent: () => import('./demo/pages/ventas-del-dia/ventas-del-dia.component').then(m => m.VentasDelDiaComponent)
            }
        ]
// ...
    },
    {
        // Layout para páginas públicas (login/registro)
        path: '',
        component: GuestLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./demo/pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
