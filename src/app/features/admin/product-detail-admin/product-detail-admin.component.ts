import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-product-detail-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LoadingSpinnerComponent],
  template: `
    <div>
      <a routerLink="/admin/products" class="text-indigo-600 hover:underline text-sm mb-4 inline-block">← Back to products</a>
      <app-loading-spinner *ngIf="loading" />
      <div *ngIf="!loading && product()" class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/3">
            <img [src]="product()!.imageUrl" [alt]="product()!.name" class="w-full h-64 md:h-full object-cover" />
          </div>
          <div class="md:w-2/3 p-8">
            <div class="flex justify-between items-start">
              <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">{{ product()!.category }}</span>
              <span class="text-sm text-gray-400">ID: {{ product()!.id }}</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-800 mt-4">{{ product()!.name }}</h1>
            <p class="text-4xl font-bold text-green-600 mt-4">&#36;{{ product()!.price }}</p>
            <div class="flex gap-6 mt-4">
              <div>
                <span class="text-gray-500 text-sm">Stock</span>
                <p class="text-xl font-semibold">{{ product()!.stock }}</p>
              </div>
              <div>
                <span class="text-gray-500 text-sm">Created</span>
                <p class="text-xl font-semibold">{{ formatDate(product()!.createdAt) }}</p>
              </div>
            </div>
            <p class="text-gray-600 mt-4 leading-relaxed">{{ product()!.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailAdminComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

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

  formatDate(date: string): string {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return date;
    }
  }
}
