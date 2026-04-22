import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LoadingSpinnerComponent],
  template: `
    <div>
      <a routerLink="/products" class="text-indigo-600 hover:underline text-sm mb-4 inline-block">← Back to products</a>
      <app-loading-spinner *ngIf="loading" />
      <div *ngIf="!loading && product()" class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/2">
            <img [src]="product()!.imageUrl" [alt]="product()!.name" class="w-full h-64 md:h-full object-cover" />
          </div>
          <div class="md:w-1/2 p-8">
            <span class="text-blue-600 font-semibold text-sm uppercase">{{ product()!.category }}</span>
            <h1 class="text-3xl font-bold text-gray-800 mt-2">{{ product()!.name }}</h1>
            <p class="text-4xl font-bold text-green-600 mt-4">&#36;{{ product()!.price }}</p>
            <p class="text-gray-500 mt-1">{{ product()!.stock }} in stock</p>
            <p class="text-gray-600 mt-4 leading-relaxed">{{ product()!.description }}</p>
            <button (click)="addToCart()"
              class="mt-6 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-medium text-lg">
              {{ 'products.addToCart' | translate }}
            </button>
          </div>
        </div>
      </div>
      <div *ngIf="!loading && !product()" class="text-center py-12">
        <p class="text-gray-500">Product not found</p>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  loading = false;
  product = signal<Product | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.productService.getProduct(id).subscribe(product => {
      this.product.set(product);
      this.loading = false;
    });
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p);
    }
  }
}
