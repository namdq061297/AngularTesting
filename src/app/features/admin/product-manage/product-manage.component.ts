import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { format } from 'date-fns';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
const PAGE_SIZE = 10;

@Component({
  selector: 'app-product-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, SearchBarComponent, PaginationComponent, ProductFormComponent, LoadingSpinnerComponent],
  template: `
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">{{ 'products.title' | translate }}</h1>
        <button (click)="openAddDialog()"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          {{ 'products.addProduct' | translate }}
        </button>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mb-4">
        <div class="flex-1">
          <app-search-bar [value]="searchQuery()" (searchChange)="onSearch($event)" placeholder="products.searchPlaceholder" />
        </div>
        <select [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange($event)"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option *ngFor="let cat of categories" [value]="cat">{{ cat === 'All' ? ('products.allCategories' | translate) : cat }}</option>
        </select>
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div *ngIf="!loading" class="bg-white rounded-xl shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'products.id' | translate }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'products.productName' | translate }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'products.category' | translate }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'products.price' | translate }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'products.stock' | translate }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'products.createdAt' | translate }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'products.actions' | translate }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let product of paginatedProducts()" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-500">{{ product.id }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img [src]="product.imageUrl" class="h-10 w-10 rounded object-cover" />
                    <span class="font-medium text-gray-800">{{ product.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{{ product.category }}</span>
                </td>
                <td class="px-6 py-4 text-sm font-medium text-green-600">&#36;{{ product.price }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ product.stock }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(product.createdAt) }}</td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <a [routerLink]="['/admin/products', product.id]"
                      class="text-blue-600 hover:underline text-sm">{{ 'common.view' | translate }}</a>
                    <button (click)="openEditDialog(product)" class="text-indigo-600 hover:underline text-sm">{{ 'common.edit' | translate }}</button>
                    <button (click)="deleteProduct(product.id)" class="text-red-600 hover:underline text-sm">{{ 'common.delete' | translate }}</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredProducts().length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">{{ 'products.noProducts' | translate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-4">
          <app-pagination
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            [totalItems]="filteredProducts().length"
            (pageChange)="onPageChange($event)" />
        </div>
      </div>

      <div *ngIf="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
          <div class="flex justify-between items-center p-6 border-b">
            <h3 class="text-xl font-semibold">{{ editProduct ? ('products.editProduct' | translate) : ('products.addProduct' | translate) }}</h3>
            <button (click)="closeDialog()" class="text-gray-400 hover:text-gray-600">&#x2715;</button>
          </div>
          <div class="p-6">
            <app-product-form [product]="editProduct" (saved)="onProductSaved($event)" (cancelled)="closeDialog()" />
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductManageComponent implements OnInit {
  private productService = inject(ProductService);
  private translate = inject(TranslateService);

  loading = false;
  showDialog = false;
  editProduct: Product | null = null;
  categories = CATEGORIES;
  selectedCategory = 'All';

  private _products = signal<Product[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);

  filteredProducts = computed(() => {
    let products = this._products();
    if (this.selectedCategory !== 'All') {
      products = products.filter(p => p.category === this.selectedCategory);
    }
    const q = this.searchQuery().toLowerCase();
    if (q) {
      products = products.filter(p => p.name.toLowerCase().includes(q));
    }
    return products;
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / PAGE_SIZE)));

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filteredProducts().slice(start, start + PAGE_SIZE);
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe(products => {
      this._products.set(products);
      this.loading = false;
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  openAddDialog(): void {
    this.editProduct = null;
    this.showDialog = true;
  }

  openEditDialog(product: Product): void {
    this.editProduct = product;
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.editProduct = null;
  }

  onProductSaved(product: Product): void {
    this.closeDialog();
    this.loadProducts();
  }

  deleteProduct(id: number): void {
    const msg = this.translate.instant('products.deleteConfirm') || 'Are you sure you want to delete this product?';
    if (confirm(msg)) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  formatDate(date: string): string {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return date;
    }
  }
}
