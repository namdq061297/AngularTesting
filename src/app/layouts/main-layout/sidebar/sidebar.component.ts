import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <aside *ngIf="isAdmin" class="fixed left-0 top-16 h-full w-64 bg-gray-900 text-white z-40 overflow-y-auto">
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <a routerLink="/admin/dashboard" routerLinkActive="bg-indigo-700"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              {{ 'nav.dashboard' | translate }}
            </a>
          </li>
          <li>
            <a routerLink="/admin/products" routerLinkActive="bg-indigo-700"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              {{ 'nav.products' | translate }}
            </a>
          </li>
          <li>
            <a routerLink="/admin/users" routerLinkActive="bg-indigo-700"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              {{ 'nav.users' | translate }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);
  get isAdmin() { return this.authService.isAdmin; }
}
