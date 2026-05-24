import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { formatDate } from '../../../../../shared/utils/format';
import { PerformanceReviewFacade } from '../../../dataProviders/performance-review.facade';
import {
  EntityRef,
  PerformanceReview,
} from '../../../models/interfaces/performance-review.interface';
import {
  getStatusPRLabel,
  getStatusPRSeverity,
} from '../../../utils/functions/performance-review.functions';

@Component({
  selector: 'app-performance-review-page',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, PageHeaderComponent],
  templateUrl: './performance-review-page.component.html',
  styleUrl: './performance-review-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceReviewPageComponent implements OnInit {
  private facade     = inject(PerformanceReviewFacade);
  private destroyRef = inject(DestroyRef);

  reviews = this.facade.reviews;
  loading = this.facade.loading;

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.facade.loadAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  fmtDate(d: string | null): string { return formatDate(d ?? undefined); }
  statusLabel(s: PerformanceReview['status']): string { return getStatusPRLabel(s); }
  statusSeverity(s: PerformanceReview['status']) { return getStatusPRSeverity(s); }
  count(arr?: EntityRef[]): number { return arr?.length ?? 0; }
}
