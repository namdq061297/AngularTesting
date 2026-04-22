import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  template: `
    <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ 'auth.resetPassword' | translate }}</h2>
    <p class="text-gray-500 text-sm mb-6">Enter your email and we will send a reset link.</p>
    <div *ngIf="!submitted">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.email' | translate }}</label>
          <input type="email" formControlName="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com" />
        </div>
        <button type="submit" [disabled]="form.invalid"
          class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
          {{ 'auth.sendResetLink' | translate }}
        </button>
      </form>
    </div>
    <div *ngIf="submitted" class="text-center">
      <div class="text-green-600 text-5xl mb-4">&#10003;</div>
      <p class="text-gray-700">Reset link sent to your email!</p>
    </div>
    <a routerLink="/login" class="block text-center text-sm text-indigo-600 hover:underline mt-6">
      {{ 'auth.backToLogin' | translate }}
    </a>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  submitted = false;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitted = true;
  }
}
