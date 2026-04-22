import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img [src]="product.imageUrl" [alt]="product.name" class="w-full h-48 object-cover" />
      <div class="p-4">
        <span class="text-xs text-blue-600 font-semibold uppercase tracking-wide">{{ product.category }}</span>
        <h3 class="text-lg font-semibold text-gray-800 mt-1 truncate">{{ product.name }}</h3>
        <p class="text-2xl font-bold text-green-600 mt-2">&#36;{{ product.price }}</p>
        <div class="flex gap-2 mt-3">
          <a [routerLink]="['/products', product.id]"
            class="flex-1 text-center bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 text-sm">
            {{ 'common.view' | translate }}
          </a>
          <button
            (click)="addToCart.emit(product)"
            class="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm">
            {{ 'products.addToCart' | translate }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
}
