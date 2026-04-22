import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ 'cart.title' | translate }}</h1>

      <div *ngIf="cartService.items().length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">&#x1F6D2;</div>
        <p class="text-gray-500 text-lg">{{ 'cart.empty' | translate }}</p>
        <a routerLink="/products" class="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
          {{ 'cart.continueShopping' | translate }}
        </a>
      </div>

      <div *ngIf="cartService.items().length > 0">
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <div *ngFor="let item of cartService.items()" class="p-4 border-b last:border-b-0">
            <div class="flex items-center gap-4">
              <img [src]="item.product.imageUrl" [alt]="item.product.name" class="h-20 w-20 object-cover rounded-lg" />
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800">{{ item.product.name }}</h3>
                <p class="text-gray-500 text-sm">{{ item.product.category }}</p>
                <p class="text-green-600 font-bold">&#36;{{ item.product.price }}</p>
              </div>
              <div class="flex items-center gap-3">
                <button (click)="decrease(item.product.id)" class="h-8 w-8 rounded-full border hover:bg-gray-100 flex items-center justify-center">-</button>
                <span class="font-semibold w-8 text-center">{{ item.quantity }}</span>
                <button (click)="increase(item.product.id, item.quantity)" class="h-8 w-8 rounded-full border hover:bg-gray-100 flex items-center justify-center">+</button>
              </div>
              <p class="font-bold text-gray-800 w-20 text-right">&#36;{{ item.product.price * item.quantity }}</p>
              <button (click)="cartService.removeFromCart(item.product.id)" class="text-red-500 hover:text-red-700 ml-2">&#x2715;</button>
            </div>
          </div>
        </div>
        <div class="mt-6 bg-white rounded-xl shadow p-6">
          <div class="flex justify-between items-center text-xl font-bold">
            <span>{{ 'cart.total' | translate }}</span>
            <span class="text-green-600">&#36;{{ cartService.totalPrice() }}</span>
          </div>
          <div class="flex gap-4 mt-4">
            <a routerLink="/products"
              class="flex-1 text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50">
              {{ 'cart.continueShopping' | translate }}
            </a>
            <button class="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
              {{ 'cart.checkout' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartPageComponent {
  cartService = inject(CartService);

  decrease(productId: number): void {
    const item = this.cartService.items().find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  increase(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }
}
