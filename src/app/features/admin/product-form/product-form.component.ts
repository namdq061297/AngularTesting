import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'products.productName' | translate }}</label>
          <input type="text" formControlName="name"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'products.category' | translate }}</label>
          <select formControlName="category"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'products.price' | translate }}</label>
          <input type="number" formControlName="price"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'products.stock' | translate }}</label>
          <input type="number" formControlName="stock"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'products.imageUrl' | translate }}</label>
          <input type="url" formControlName="imageUrl"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'products.description' | translate }}</label>
          <textarea formControlName="description" rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
        </div>
      </div>
      <div class="flex gap-3 justify-end mt-6">
        <button type="button" (click)="cancelled.emit()"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          {{ 'common.cancel' | translate }}
        </button>
        <button type="submit" [disabled]="form.invalid"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {{ 'common.save' | translate }}
        </button>
      </div>
    </form>
  `
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  @Input() product: Product | null = null;
  @Output() saved = new EventEmitter<Product>();
  @Output() cancelled = new EventEmitter<void>();

  categories = CATEGORIES;

  form = this.fb.group({
    name: ['', Validators.required],
    category: ['Electronics', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    description: [''],
    imageUrl: ['https://picsum.photos/seed/new/400/300']
  });

  ngOnInit(): void {
    if (this.product) {
      this.form.patchValue(this.product);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.product) {
      this.productService.updateProduct(this.product.id, data as Partial<Product>).subscribe(p => this.saved.emit(p));
    } else {
      const newProduct = {
        ...data,
        createdAt: new Date().toISOString()
      } as Omit<Product, 'id'>;
      this.productService.createProduct(newProduct).subscribe(p => this.saved.emit(p));
    }
  }
}
