import { Injectable, signal } from '@angular/core';
import { PerformanceReview } from '../models/interfaces/performance-review.interface';

@Injectable({ providedIn: 'root' })
export class PerformanceReviewStore {
  private _items = signal<PerformanceReview[]>([]);
  readonly items = this._items.asReadonly();

  setAll(items: PerformanceReview[]): void {
    this._items.set(items);
  }
}
