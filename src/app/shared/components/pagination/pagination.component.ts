import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flex items-center justify-between mt-4">
      <span class="text-sm text-gray-600">
        {{ 'common.page' | translate }} {{ currentPage }} {{ 'common.of' | translate }} {{ totalPages }}
        ({{ totalItems }} {{ 'common.items' | translate }})
      </span>
      <div class="flex gap-2">
        <button
          (click)="pageChange.emit(currentPage - 1)"
          [disabled]="currentPage <= 1"
          class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">
          {{ 'common.previous' | translate }}
        </button>
        <button
          (click)="pageChange.emit(currentPage + 1)"
          [disabled]="currentPage >= totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">
          {{ 'common.next' | translate }}
        </button>
      </div>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Output() pageChange = new EventEmitter<number>();
}
