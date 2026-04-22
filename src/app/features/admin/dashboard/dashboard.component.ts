import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ 'nav.dashboard' | translate }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-gray-500 text-sm">Total Products</p>
          <p class="text-4xl font-bold text-indigo-600 mt-2">{{ productCount() }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-gray-500 text-sm">Categories</p>
          <p class="text-4xl font-bold text-green-600 mt-2">5</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-gray-500 text-sm">Total Users</p>
          <p class="text-4xl font-bold text-blue-600 mt-2">3</p>
        </div>
      </div>
      <div class="mt-6">
        <a routerLink="/admin/products" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 inline-block">
          Manage Products
        </a>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  productCount = signal(0);

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => this.productCount.set(products.length));
  }
}
