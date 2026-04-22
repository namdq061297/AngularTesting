import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

const MOCK_USERS: User[] = [
  { id: 1, email: 'admin@example.com', name: 'Admin User', role: 'admin', avatarUrl: 'https://i.pravatar.cc/100?u=admin' },
  { id: 2, email: 'user@example.com', name: 'John Doe', role: 'user', avatarUrl: 'https://i.pravatar.cc/100?u=user' },
  { id: 3, email: 'jane@example.com', name: 'Jane Smith', role: 'user', avatarUrl: 'https://i.pravatar.cc/100?u=jane' }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);
  private router = inject(Router);

  private _currentUser = new BehaviorSubject<User | null>(this.storage.get<User>('currentUser'));
  currentUser$ = this._currentUser.asObservable();

  get currentUser(): User | null {
    return this._currentUser.value;
  }

  get isLoggedIn(): boolean {
    return !!this._currentUser.value;
  }

  get isAdmin(): boolean {
    return this._currentUser.value?.role === 'admin';
  }

  login(email: string, _password: string): boolean {
    let user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      user = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        role: 'user',
        avatarUrl: `https://i.pravatar.cc/100?u=${email}`
      };
    }
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
    this.storage.set('token', token);
    this.storage.set('currentUser', user);
    this._currentUser.next(user);
    return true;
  }

  signup(email: string, _password: string, name: string): boolean {
    const user: User = {
      id: Date.now(),
      email,
      name,
      role: 'user',
      avatarUrl: `https://i.pravatar.cc/100?u=${email}`
    };
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
    this.storage.set('token', token);
    this.storage.set('currentUser', user);
    this._currentUser.next(user);
    return true;
  }

  updateProfile(updates: Partial<User>): void {
    const current = this._currentUser.value;
    if (!current) return;
    const updated = { ...current, ...updates };
    this.storage.set('currentUser', updated);
    this._currentUser.next(updated);
  }

  logout(): void {
    this.storage.remove('token');
    this.storage.remove('currentUser');
    this._currentUser.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storage.get<string>('token');
  }
}
