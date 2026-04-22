import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  template: `
    <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ 'auth.signup' | translate }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.name' | translate }}</label>
        <input type="text" formControlName="name"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="John Doe" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.email' | translate }}</label>
        <input type="email" formControlName="email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="you@example.com" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.password' | translate }}</label>
        <input type="password" formControlName="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="..." />
      </div>
      <button type="submit" [disabled]="form.invalid"
        class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
        {{ 'auth.signup' | translate }}
      </button>
    </form>
    <p class="text-center text-sm text-gray-600 mt-6">
      {{ 'auth.hasAccount' | translate }}
      <a routerLink="/login" class="text-indigo-600 font-medium hover:underline">{{ 'auth.login' | translate }}</a>
    </p>
  `
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, password, name } = this.form.value;
    this.authService.signup(email!, password!, name!);
  }
}
