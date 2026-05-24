import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerformanceReview } from '../models/interfaces/performance-review.interface';

@Injectable({ providedIn: 'root' })
export class PerformanceReviewApi {
  private http = inject(HttpClient);

  /** GET /api/admin/performance-reviews — все performance review. */
  getAll(): Observable<PerformanceReview[]> {
    return this.http.get<PerformanceReview[]>('/api/admin/performance-reviews');
  }
}
