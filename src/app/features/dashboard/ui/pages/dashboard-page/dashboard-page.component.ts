import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';

import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { formatDate } from '../../../../../shared/utils/format';
import { initialsOf } from '../../../../../shared/utils/text';
import { DashboardFacade } from '../../../dataProviders/dashboard.facade';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { IprStatus } from '../../../../ipr/enums/ipr-status.enum';
import { calcProgress, getIprStatusLabel } from '../../../../ipr/utils/functions/ipr.functions';
import { DevelopmentPlanEmployee } from '../../../../ipr/models/interfaces/ipr-plan.interface';
import { getEmploymentStatusLabel, getHumanStatusSeverity } from '../../../../employees/utils/functions/employees.functions';
import { EmploymentStatus } from '../../../../employees/enums/employment-status.enum';
import { NewsStatus } from '../../../../news/enums/news-status.enum';
import { getNewsStatusLabel } from '../../../../news/utils/functions/news.functions';

type AnyStatus = IprStatus | EmploymentStatus | NewsStatus | string;

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, ButtonModule, TagModule, AvatarModule, ProgressBarModule, SkeletonModule, PageHeaderComponent, KpiCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private facade     = inject(DashboardFacade);
  private destroyRef = inject(DestroyRef);

  s = this.facade.stats;
  plans = this.facade.recentPlans;
  plansLoading = this.facade.recentPlansLoading;
  surveys = this.facade.activeSurveys;
  news = this.facade.upcomingNews;
  recentHumans        = this.facade.recentHumans;
  recentHumansLoading = this.facade.recentHumansLoading;
  totalResponses = this.facade.totalResponses;

  ngOnInit(): void {
    this.facade.loadRecentHumans()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.facade.loadRecentDevelopmentPlans()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /** ФИО сотрудника плана развития. */
  planEmployeeName(e?: DevelopmentPlanEmployee | null): string {
    if (!e) return '—';
    return [e.lastName, e.firstName, e.patronymic].filter(Boolean).join(' ') || '—';
  }
  planEmployeeIni(e?: DevelopmentPlanEmployee | null): string {
    if (!e) return '';
    return initialsOf(`${e.firstName ?? ''} ${e.lastName ?? ''}`);
  }
  planProgress(completed: number, total: number): number { return calcProgress(completed, total); }

  ini(n: string) { return initialsOf(n); }
  fmt(d: string | null | undefined) { return d ? formatDate(d) : '—'; }
  percent(a: number, b: number) { return b ? Math.round((a / b) * 100) : 0; }

  humanStatusSeverity(s: string): 'success' | 'warn' | 'info' | 'danger' | 'secondary' {
    return getHumanStatusSeverity(s);
  }

  tagSeverity(s: AnyStatus): 'secondary' | 'info' | 'success' | 'warn' | 'danger' {
    const iprMap: Record<IprStatus, 'secondary' | 'info' | 'success' | 'warn' | 'danger'> = {
      [IprStatus.Draft]: 'secondary', [IprStatus.InProgress]: 'info',
      [IprStatus.OnReview]: 'warn', [IprStatus.Completed]: 'success', [IprStatus.Overdue]: 'danger',
    };
    const empMap: Record<EmploymentStatus, 'success' | 'warn' | 'info' | 'secondary'> = {
      [EmploymentStatus.Active]: 'success', [EmploymentStatus.Leave]: 'warn',
      [EmploymentStatus.Probation]: 'info', [EmploymentStatus.Terminated]: 'secondary',
    };
    const newsMap: Record<NewsStatus, 'secondary' | 'info' | 'success' | 'warn'> = {
      [NewsStatus.Draft]: 'secondary', [NewsStatus.Scheduled]: 'info',
      [NewsStatus.Published]: 'success', [NewsStatus.Archived]: 'secondary',
    };
    return (iprMap[s as IprStatus] ?? empMap[s as EmploymentStatus] ?? newsMap[s as NewsStatus] ?? 'secondary') as 'secondary' | 'info' | 'success' | 'warn' | 'danger';
  }

  label(s: AnyStatus): string {
    if (Object.values(IprStatus).includes(s as IprStatus)) return getIprStatusLabel(s as IprStatus);
    if (Object.values(EmploymentStatus).includes(s as EmploymentStatus)) return getEmploymentStatusLabel(s as EmploymentStatus);
    if (Object.values(NewsStatus).includes(s as NewsStatus)) return getNewsStatusLabel(s as NewsStatus);
    return s;
  }
}
