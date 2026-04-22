import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <app-navbar />
    <app-sidebar />
    <main [class.ml-64]="isAdmin" class="pt-16 min-h-screen bg-gray-50">
      <div class="p-6">
        <router-outlet />
      </div>
    </main>
  `
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  get isAdmin() { return this.authService.isAdmin; }
}
