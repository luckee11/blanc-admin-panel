import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';

import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { initialsOf } from '../../../../../shared/utils/text';
import { IprFacade } from '../../../dataProviders/ipr.facade';
import { DevelopmentPlanPerson } from '../../../models/interfaces/ipr-plan.interface';
import {
  DevelopmentPlanItemStatusCounts,
  DevelopmentPlanStatusCounts,
} from '../../../models/interfaces/development-plan-analytics.interface';
import {
  ITEM_STATUS_META,
  PLAN_STATUS_META,
  planStatusBadge,
  planStatusLabel,
} from '../../../utils/constants/analytics-status.constants';
import { calcProgress } from '../../../utils/functions/ipr.functions';

@Component({
  selector: 'app-group-analytics',
  standalone: true,
  imports: [NgTemplateOutlet, ButtonModule, TagModule, AvatarModule, ProgressBarModule, SkeletonModule, PageHeaderComponent],
  templateUrl: './group-analytics.component.html',
  styleUrl: './group-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupAnalyticsComponent implements OnInit, OnDestroy {
  readonly groupId = input.required<string>();

  private facade     = inject(IprFacade);
  private router     = inject(Router);
  private destroyRef = inject(DestroyRef);

  group   = this.facade.groupAnalytics;
  loading = this.facade.groupAnalyticsLoading;

  readonly statuses = PLAN_STATUS_META;
  readonly itemStatuses = ITEM_STATUS_META;

  ngOnInit(): void {
    this.facade.loadGroupAnalytics(this.groupId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.facade.clearGroupAnalytics();
  }

  back(): void {
    this.router.navigate(['/ipr/analytics']);
  }

  fullName(p?: DevelopmentPlanPerson | null): string {
    if (!p) return '—';
    return [p.lastName, p.firstName, p.patronymic].filter(Boolean).join(' ') || '—';
  }
  ini(p?: DevelopmentPlanPerson | null): string {
    if (!p) return '';
    return initialsOf(`${p.firstName ?? ''} ${p.lastName ?? ''}`);
  }

  planCount(c: DevelopmentPlanStatusCounts, key: keyof DevelopmentPlanStatusCounts): number {
    return c[key] ?? 0;
  }
  itemCount(c: DevelopmentPlanItemStatusCounts, key: keyof DevelopmentPlanItemStatusCounts): number {
    return c[key] ?? 0;
  }
  progress(done: number, total: number): number { return calcProgress(done, total); }

  statusLabel(s: string): string { return planStatusLabel(s); }
  statusBadge(s: string): string { return planStatusBadge(s); }
}
