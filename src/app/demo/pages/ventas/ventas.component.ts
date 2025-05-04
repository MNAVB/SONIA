// src/app/demo/pages/ventas/ventas.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent {}
