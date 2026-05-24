import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { IprFacade } from '../../../dataProviders/ipr.facade';
import { DevelopmentPlanStatusCounts } from '../../../models/interfaces/development-plan-analytics.interface';
import { PLAN_STATUS_META } from '../../../utils/constants/analytics-status.constants';

@Component({
  selector: 'app-ipr-analytics',
  standalone: true,
  imports: [ButtonModule, SkeletonModule, PageHeaderComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit {
  private facade     = inject(IprFacade);
  private router     = inject(Router);
  private destroyRef = inject(DestroyRef);

  analytics = this.facade.analytics;
  loading   = this.facade.analyticsLoading;

  readonly statuses = PLAN_STATUS_META;

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.facade.loadDevelopmentPlansAnalytics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  openGroup(groupId: string): void {
    this.router.navigate(['/ipr/analytics/group', groupId]);
  }

  count(counts: DevelopmentPlanStatusCounts, key: keyof DevelopmentPlanStatusCounts): number {
    return counts[key] ?? 0;
  }
}
