import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { formatDate } from '../../../../../shared/utils/format';
import { initialsOf } from '../../../../../shared/utils/text';
import { IprFacade } from '../../../dataProviders/ipr.facade';
import {
  DevelopmentPlanEmployee,
  DevelopmentPlanListItem,
  DevelopmentPlanSupervisor,
} from '../../../models/interfaces/ipr-plan.interface';
import { IprStatus } from '../../../enums/ipr-status.enum';
import { calcProgress, getIprStatusLabel } from '../../../utils/functions/ipr.functions';

const DEFAULT_PAGE_SIZE = 10;

@Component({
  selector: 'app-ipr-plans',
  standalone: true,
  imports: [
    FormsModule,
    TableModule, ButtonModule, InputTextModule, SelectModule,
    TagModule, AvatarModule, ProgressBarModule,
    IconFieldModule, InputIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansComponent implements OnDestroy {
  private facade     = inject(IprFacade);
  private router     = inject(Router);
  private destroyRef = inject(DestroyRef);

  plans      = this.facade.developmentPlans;
  pagination = this.facade.plansPagination;
  loading    = this.facade.plansLoading;

  searchKeyword   = '';
  selectedStatus: IprStatus | '' = '';
  currentPageSize = DEFAULT_PAGE_SIZE;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  statusFilterOptions = [
    { label: 'Все статусы', value: '' },
    { label: 'Черновик', value: IprStatus.Draft },
    { label: 'В работе', value: IprStatus.InProgress },
    { label: 'На ревью', value: IprStatus.OnReview },
    { label: 'Завершён', value: IprStatus.Completed },
    { label: 'Просрочен', value: IprStatus.Overdue },
  ];

  readonly IprStatus = IprStatus;

  /* ===== Серверные поиск / фильтр / пагинация (POST /api/admin/development-plans/search) ===== */
  onLazyLoad(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? DEFAULT_PAGE_SIZE;
    const page = Math.floor((event.first ?? 0) / rows);
    this.currentPageSize = rows;
    this.runSearch(page, rows);
  }

  onSearchInput(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.runSearch(0, this.currentPageSize), 400);
  }

  onStatusChange(): void {
    this.runSearch(0, this.currentPageSize);
  }

  refresh(): void {
    this.runSearch(0, this.currentPageSize);
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  private runSearch(page: number, pageSize: number): void {
    this.facade.searchDevelopmentPlans({
      keyword: this.searchKeyword.trim() || undefined,
      page,
      pageSize,
      status: this.selectedStatus ? [this.selectedStatus] : undefined,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /** Счётчик по статусу в пределах загруженной страницы. */
  count(s: IprStatus): number {
    return this.plans().filter((p) => p.status === s).length;
  }

  /* ===== Детальный просмотр (отдельная страница) ===== */
  openDetail(p: DevelopmentPlanListItem): void {
    this.router.navigate(['/ipr/plans', p.id]);
  }

  /* ===== Хелперы отображения ===== */
  fullName(p?: DevelopmentPlanEmployee | DevelopmentPlanSupervisor | null): string {
    if (!p) return '—';
    return [p.lastName, p.firstName, p.patronymic].filter(Boolean).join(' ') || '—';
  }

  ini(p?: DevelopmentPlanEmployee | DevelopmentPlanSupervisor | null): string {
    if (!p) return '';
    return initialsOf(`${p.firstName ?? ''} ${p.lastName ?? ''}`);
  }

  progress(p: DevelopmentPlanListItem): number {
    return calcProgress(p.completedItemsCount, p.itemsCount);
  }

  tagSeverity(s: IprStatus): 'secondary' | 'info' | 'warn' | 'success' | 'danger' {
    const map: Record<IprStatus, 'secondary' | 'info' | 'warn' | 'success' | 'danger'> = {
      [IprStatus.Draft]: 'secondary', [IprStatus.InProgress]: 'info',
      [IprStatus.OnReview]: 'warn', [IprStatus.Completed]: 'success', [IprStatus.Overdue]: 'danger',
    };
    return map[s] ?? 'secondary';
  }

  label(s: IprStatus): string { return getIprStatusLabel(s); }
  fmt(d?: string | null): string { return formatDate(d ?? undefined); }
}
