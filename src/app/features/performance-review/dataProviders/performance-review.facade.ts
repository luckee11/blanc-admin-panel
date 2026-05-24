import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, tap } from 'rxjs';
import { PerformanceReviewApi } from './performance-review.api';
import { PerformanceReviewStore } from './performance-review.store';

@Injectable({ providedIn: 'root' })
export class PerformanceReviewFacade {
  private api   = inject(PerformanceReviewApi);
  private store = inject(PerformanceReviewStore);

  readonly reviews = this.store.items;

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  /** Загрузка всех performance review (GET /api/admin/performance-reviews). */
  loadAll(): Observable<void> {
    this._loading.set(true);
    return this.api.getAll().pipe(
      tap((list) => this.store.setAll(list)),
      finalize(() => this._loading.set(false)),
      map(() => undefined),
    );
  }
}
