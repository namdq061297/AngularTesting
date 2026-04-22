import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  template: `
    <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ 'auth.login' | translate }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.email' | translate }}</label>
        <input type="email" formControlName="email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          [class.border-red-500]="form.get('email')?.invalid && form.get('email')?.touched"
          placeholder="you@example.com" />
        <p *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="text-red-500 text-xs mt-1">
          {{ 'errors.invalidEmail' | translate }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.password' | translate }}</label>
        <input type="password" formControlName="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          [class.border-red-500]="form.get('password')?.invalid && form.get('password')?.touched"
          placeholder="..." />
        <p *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="text-red-500 text-xs mt-1">
          {{ 'errors.required' | translate }}
        </p>
      </div>
      <div class="flex justify-end">
        <a routerLink="/forgot-password" class="text-sm text-indigo-600 hover:underline">
          {{ 'auth.forgotPassword' | translate }}
        </a>
      </div>
      <button type="submit" [disabled]="form.invalid"
        class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors">
        {{ 'auth.login' | translate }}
      </button>
      <p *ngIf="error" class="text-red-500 text-sm text-center">{{ error }}</p>
    </form>
    <p class="text-center text-sm text-gray-600 mt-6">
      {{ 'auth.noAccount' | translate }}
      <a routerLink="/signup" class="text-indigo-600 font-medium hover:underline">{{ 'auth.signup' | translate }}</a>
    </p>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  error = '';
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    const success = this.authService.login(email!, password!);
    if (!success) {
      this.error = 'Login failed';
    }
  }
}
