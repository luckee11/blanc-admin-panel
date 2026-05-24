import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { TaskPriorityBadgeComponent } from '../../components/task-priority-badge/task-priority-badge.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { formatDate } from '../../../../../shared/utils/format';
import { initialsOf } from '../../../../../shared/utils/text';
import { IprFacade } from '../../../dataProviders/ipr.facade';
import { DevelopmentPlanPerson } from '../../../models/interfaces/ipr-plan.interface';
import { IprStatus } from '../../../enums/ipr-status.enum';
import {
  calcProgress,
  getItemStatusLabel,
  getItemStatusSeverity,
  getIprStatusLabel,
  isItemDone,
} from '../../../utils/functions/ipr.functions';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [
    ButtonModule, TagModule, AvatarModule, ProgressBarModule, SkeletonModule,
    ConfirmDeleteComponent, TaskPriorityBadgeComponent,
  ],
  templateUrl: './plan-detail.component.html',
  styleUrl: './plan-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailComponent implements OnInit, OnDestroy {
  readonly id = input.required<string>();

  private facade     = inject(IprFacade);
  private router     = inject(Router);
  private toast      = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  plan    = this.facade.selectedPlan;
  loading = this.facade.selectedPlanLoading;

  confirmVisible = signal(false);
  deleting       = signal(false);

  readonly employeeName = computed(() => this.fullName(this.plan()?.employee));

  readonly itemsTotal = computed(() => this.plan()?.items.length ?? 0);
  readonly itemsDone  = computed(() => this.plan()?.items.filter((i) => isItemDone(i.status)).length ?? 0);
  readonly progressValue = computed(() => calcProgress(this.itemsDone(), this.itemsTotal()));

  ngOnInit(): void {
    this.facade.loadDevelopmentPlanById(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.facade.clearSelectedPlan();
  }

  back(): void {
    this.router.navigate(['/ipr/plans']);
  }

  confirmDelete(): void {
    this.confirmVisible.set(false);
    this.deleting.set(true);
    this.facade.deleteDevelopmentPlan(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.toast.success('План удалён', this.employeeName());
          this.router.navigate(['/ipr/plans']);
        },
        error: () => {
          this.deleting.set(false);
          this.toast.error('Не удалось удалить план', 'Попробуйте ещё раз');
        },
      });
  }

  /* ===== Helpers ===== */
  fullName(p?: DevelopmentPlanPerson | null): string {
    if (!p) return '—';
    return [p.lastName, p.firstName, p.patronymic].filter(Boolean).join(' ') || '—';
  }

  ini(p?: DevelopmentPlanPerson | null): string {
    if (!p) return '';
    return initialsOf(`${p.firstName ?? ''} ${p.lastName ?? ''}`);
  }

  label(s: IprStatus): string { return getIprStatusLabel(s); }

  tagSeverity(s: IprStatus): 'secondary' | 'info' | 'warn' | 'success' | 'danger' {
    const map: Record<IprStatus, 'secondary' | 'info' | 'warn' | 'success' | 'danger'> = {
      [IprStatus.Draft]: 'secondary', [IprStatus.InProgress]: 'info',
      [IprStatus.OnReview]: 'warn', [IprStatus.Completed]: 'success', [IprStatus.Overdue]: 'danger',
    };
    return map[s] ?? 'secondary';
  }

  itemStatusLabel(s: string): string { return getItemStatusLabel(s); }
  itemStatusSeverity(s: string): 'secondary' | 'info' | 'warn' | 'success' | 'danger' {
    return getItemStatusSeverity(s);
  }

  fmt(d?: string | null): string { return d ? formatDate(d) : '—'; }
}
