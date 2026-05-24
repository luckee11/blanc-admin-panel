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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { formatDate } from '../../../../../shared/utils/format';
import { initialsOf } from '../../../../../shared/utils/text';
import { IprFacade } from '../../../dataProviders/ipr.facade';
import { DevelopmentPlanPerson } from '../../../models/interfaces/ipr-plan.interface';
import { TaskPriority } from '../../../enums/task-priority.enum';
import { DevelopmentPlanItemStatus } from '../../../enums/development-plan-item-status.enum';
import { getPriorityLabel } from '../../../utils/functions/ipr.functions';
import {
  ITEM_STATUS_META,
  itemStatusLabel,
  itemStatusSeverity,
} from '../../../utils/constants/analytics-status.constants';

const DEFAULT_PAGE_SIZE = 10;

@Component({
  selector: 'app-ipr-tasks',
  standalone: true,
  imports: [
    FormsModule,
    TableModule, ButtonModule, InputTextModule, SelectModule,
    TagModule, AvatarModule, IconFieldModule, InputIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnDestroy {
  private facade     = inject(IprFacade);
  private router     = inject(Router);
  private destroyRef = inject(DestroyRef);

  tasks      = this.facade.developmentPlanItems;
  pagination = this.facade.itemsPagination;
  loading    = this.facade.itemsLoading;

  searchKeyword = '';
  selectedStatus: DevelopmentPlanItemStatus | '' = '';
  selectedPriority: TaskPriority | '' = '';
  currentPageSize = DEFAULT_PAGE_SIZE;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  statusOptions = [
    { label: 'Все статусы', value: '' as DevelopmentPlanItemStatus | '' },
    ...ITEM_STATUS_META.map((m) => ({ label: m.label, value: m.key as DevelopmentPlanItemStatus })),
  ];

  priorityOptions = [
    { label: 'Любой приоритет', value: '' as TaskPriority | '' },
    { label: 'Высокий', value: TaskPriority.High },
    { label: 'Средний', value: TaskPriority.Medium },
    { label: 'Низкий',  value: TaskPriority.Low },
  ];

  /* ===== Серверные поиск / фильтр / пагинация (POST /api/admin/development-plans/items/search) ===== */
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

  onFilterChange(): void {
    this.runSearch(0, this.currentPageSize);
  }

  refresh(): void {
    this.runSearch(0, this.currentPageSize);
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  private runSearch(page: number, pageSize: number): void {
    this.facade.searchDevelopmentPlanItems({
      keyword: this.searchKeyword.trim() || undefined,
      page,
      pageSize,
      status: this.selectedStatus ? [this.selectedStatus] : undefined,
      priority: this.selectedPriority ? [this.selectedPriority] : undefined,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  openPlan(planId: string): void {
    if (planId) this.router.navigate(['/ipr/plans', planId]);
  }

  /* ===== Хелперы ===== */
  fullName(p?: DevelopmentPlanPerson | null): string {
    if (!p) return '—';
    return [p.lastName, p.firstName, p.patronymic].filter(Boolean).join(' ') || '—';
  }
  ini(p?: DevelopmentPlanPerson | null): string {
    if (!p) return '';
    return initialsOf(`${p.firstName ?? ''} ${p.lastName ?? ''}`);
  }

  statusLabel(s: string): string { return itemStatusLabel(s); }
  statusSeverity(s: string) { return itemStatusSeverity(s); }

  pLabel(p: TaskPriority): string { return getPriorityLabel(p); }
  prioritySeverity(p: TaskPriority): 'danger' | 'warn' | 'secondary' {
    if (p === TaskPriority.High) return 'danger';
    if (p === TaskPriority.Medium) return 'warn';
    return 'secondary';
  }

  fmt(d?: string | null): string { return d ? formatDate(d) : '—'; }
}
