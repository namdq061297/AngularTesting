import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private storage = inject(StorageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private _items = signal<CartItem[]>(this.loadCart());

  items = this._items.asReadonly();
  totalItems = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));
  totalPrice = computed(() => this._items().reduce((sum, item) => sum + (item.product.price * item.quantity), 0));

  private loadCart(): CartItem[] {
    return this.storage.get<CartItem[]>('cart') || [];
  }

  private saveCart(): void {
    this.storage.set('cart', this._items());
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    const current = this._items();
    const existing = current.find(item => item.product.id === product.id);
    if (existing) {
      this._items.set(current.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      this._items.set([...current, { product, quantity: 1 }]);
    }
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    this._items.set(this._items().filter(item => item.product.id !== productId));
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._items.set(this._items().map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
    this.saveCart();
  }

  clearCart(): void {
    this._items.set([]);
    this.saveCart();
  }
}
