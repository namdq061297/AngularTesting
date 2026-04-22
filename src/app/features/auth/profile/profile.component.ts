import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ 'nav.profile' | translate }}</h2>
      <div class="bg-white rounded-xl shadow p-6">
        <div class="flex items-center gap-4 mb-6">
          <img [src]="currentUser?.avatarUrl || 'https://i.pravatar.cc/80'" class="h-20 w-20 rounded-full" />
          <div>
            <h3 class="text-xl font-semibold">{{ currentUser?.name }}</h3>
            <p class="text-gray-500">{{ currentUser?.email }}</p>
            <span class="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full capitalize">{{ currentUser?.role }}</span>
          </div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.name' | translate }}</label>
            <input type="text" formControlName="name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.avatarUrl' | translate }}</label>
            <input type="url" formControlName="avatarUrl"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" [disabled]="form.invalid"
            class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
            {{ 'auth.updateProfile' | translate }}
          </button>
          <p *ngIf="saved" class="text-green-600 text-sm text-center">{{ 'auth.profileUpdated' | translate }}</p>
        </form>
      </div>
    </div>
  `
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  saved = false;
  get currentUser() { return this.authService.currentUser; }

  form = this.fb.group({
    name: [this.authService.currentUser?.name || '', Validators.required],
    avatarUrl: [this.authService.currentUser?.avatarUrl || '']
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.authService.updateProfile(this.form.value as Partial<User>);
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }
}
