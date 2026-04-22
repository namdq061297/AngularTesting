import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a routerLink="/" class="text-xl font-bold text-indigo-700">ShopApp</a>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                (click)="switchLang('en')"
                [class.bg-white]="currentLang === 'en'"
                [class.shadow-sm]="currentLang === 'en'"
                class="px-3 py-1 rounded text-sm font-medium transition-all">
                EN
              </button>
              <button
                (click)="switchLang('vi')"
                [class.bg-white]="currentLang === 'vi'"
                [class.shadow-sm]="currentLang === 'vi'"
                class="px-3 py-1 rounded text-sm font-medium transition-all">
                VI
              </button>
            </div>

            <a *ngIf="!isAdmin" routerLink="/cart" class="relative flex items-center text-gray-600 hover:text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span *ngIf="totalItems() > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ totalItems() }}
              </span>
            </a>

            <div *ngIf="isLoggedIn" class="relative" (click)="toggleDropdown()">
              <div class="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <img [src]="currentUser?.avatarUrl || 'https://i.pravatar.cc/40'" alt="avatar" class="h-8 w-8 rounded-full" />
                <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ currentUser?.name }}</span>
              </div>
              <div *ngIf="dropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <a routerLink="/profile" (click)="dropdownOpen=false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {{ 'nav.profile' | translate }}
                </a>
                <button (click)="logout()"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  {{ 'nav.logout' | translate }}
                </button>
              </div>
            </div>

            <a *ngIf="!isLoggedIn" routerLink="/login" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
              {{ 'nav.login' | translate }}
            </a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private translate = inject(TranslateService);
  private storage = inject(StorageService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  dropdownOpen = false;
  currentLang = this.translate.currentLang || 'en';

  get isLoggedIn() { return this.authService.isLoggedIn; }
  get isAdmin() { return this.authService.isAdmin; }
  get currentUser() { return this.authService.currentUser; }
  totalItems = this.cartService.totalItems;

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    this.storage.set('lang', lang);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.dropdownOpen = false;
    this.authService.logout();
  }
}
