import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
const PAGE_SIZE = 10;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ProductCardComponent, SearchBarComponent, PaginationComponent, LoadingSpinnerComponent],
  template: `
    <div>
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="flex-1">
          <app-search-bar [value]="searchQuery()" (searchChange)="onSearch($event)" placeholder="products.searchPlaceholder" />
        </div>
        <select [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange($event)"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option *ngFor="let cat of categories" [value]="cat">{{ cat === 'All' ? ('products.allCategories' | translate) : cat }}</option>
        </select>
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div *ngIf="!loading && filteredProducts().length === 0" class="text-center py-12 text-gray-500">
        {{ 'products.noProducts' | translate }}
      </div>

      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <app-product-card
          *ngFor="let product of paginatedProducts()"
          [product]="product"
          (addToCart)="onAddToCart($event)" />
      </div>

      <app-pagination
        *ngIf="!loading && filteredProducts().length > 0"
        [currentPage]="currentPage()"
        [totalPages]="totalPages()"
        [totalItems]="filteredProducts().length"
        (pageChange)="onPageChange($event)" />
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  loading = false;
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

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
