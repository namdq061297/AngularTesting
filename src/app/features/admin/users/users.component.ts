import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

const MOCK_USERS = [
  { id: 1, email: 'admin@example.com', name: 'Admin User', role: 'admin', avatarUrl: 'https://i.pravatar.cc/40?u=admin' },
  { id: 2, email: 'user@example.com', name: 'John Doe', role: 'user', avatarUrl: 'https://i.pravatar.cc/40?u=user' },
  { id: 3, email: 'jane@example.com', name: 'Jane Smith', role: 'user', avatarUrl: 'https://i.pravatar.cc/40?u=jane' }
];

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ 'nav.users' | translate }}</h1>
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let user of users" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-500">{{ user.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img [src]="user.avatarUrl" class="h-8 w-8 rounded-full" />
                  <span class="font-medium">{{ user.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span [class]="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'"
                  class="px-2 py-1 text-xs rounded-full capitalize">{{ user.role }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UsersComponent {
  users = MOCK_USERS;
}
