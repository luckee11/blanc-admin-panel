import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { formatDate } from '../../../../../shared/utils/format';
import { initialsOf } from '../../../../../shared/utils/text';
import { IprFacade } from '../../../dataProviders/ipr.facade';
import { IprPlan } from '../../../models/interfaces/ipr-plan.interface';
import { IprStatus } from '../../../enums/ipr-status.enum';
import { getIprStatusLabel } from '../../../utils/functions/ipr.functions';

@Component({
  selector: 'app-ipr-plans',
  standalone: true,
  imports: [
    FormsModule,
    TableModule, ButtonModule, InputTextModule, TextareaModule, SelectModule,
    TagModule, AvatarModule, ProgressBarModule, SliderModule, TooltipModule,
    IconFieldModule, InputIconModule,
    ModalComponent, PageHeaderComponent, ConfirmDeleteComponent,
  ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansComponent {
  private facade     = inject(IprFacade);
  private destroyRef = inject(DestroyRef);

  plans = this.facade.plans;
  globalFilter = '';

  statusFilterOptions = [
    { label: 'Все статусы', value: '' },
    { label: 'Черновик', value: IprStatus.Draft },
    { label: 'В работе', value: IprStatus.InProgress },
    { label: 'На ревью', value: IprStatus.OnReview },
    { label: 'Завершён', value: IprStatus.Completed },
    { label: 'Просрочен', value: IprStatus.Overdue },
  ];
  selectedStatus = '';

  statusFormOptions = [
    { label: 'Черновик', value: IprStatus.Draft },
    { label: 'В работе', value: IprStatus.InProgress },
    { label: 'На ревью', value: IprStatus.OnReview },
    { label: 'Завершён', value: IprStatus.Completed },
    { label: 'Просрочен', value: IprStatus.Overdue },
  ];

  count(s: IprStatus) { return this.plans().filter((p) => p.status === s).length; }

  readonly IprStatus = IprStatus;

  modal = signal<'form' | 'view' | 'delete' | null>(null);
  editing = signal<IprPlan | null>(null);
  form: IprPlan = this.empty();

  empty(): IprPlan {
    return {
      id: '', employeeName: '', position: '', period: '2026 H1', goal: '',
      status: IprStatus.Draft, progress: 0, tasksTotal: 0, tasksDone: 0, mentor: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    };
  }

  canSave() { return !!(this.form.employeeName && this.form.goal && this.form.period); }

  openCreate() { this.form = this.empty(); this.editing.set(null); this.modal.set('form'); }
  openEdit(p: IprPlan) { this.form = { ...p }; this.editing.set(p); this.modal.set('form'); }
  openView(p: IprPlan) { this.editing.set(p); this.modal.set('view'); }
  openDelete(p: IprPlan) { this.editing.set(p); this.modal.set('delete'); }
  closeModal() { this.modal.set(null); this.editing.set(null); }

  save() {
    if (!this.canSave()) return;
    this.form.progress = Number(this.form.progress) || 0;
    const op$ = this.editing()?.id
      ? this.facade.updatePlan(this.form)
      : this.facade.createPlan(this.form);
    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closeModal());
  }

  doDelete() {
    const p = this.editing();
    if (!p) { this.closeModal(); return; }
    this.facade.deletePlan(p.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeModal());
  }

  tagSeverity(s: IprStatus): 'secondary' | 'info' | 'warn' | 'success' | 'danger' {
    const map: Record<IprStatus, 'secondary' | 'info' | 'warn' | 'success' | 'danger'> = {
      [IprStatus.Draft]: 'secondary', [IprStatus.InProgress]: 'info',
      [IprStatus.OnReview]: 'warn', [IprStatus.Completed]: 'success', [IprStatus.Overdue]: 'danger',
    };
    return map[s] ?? 'secondary';
  }

  ini(n: string) { return initialsOf(n); }
  label(s: IprStatus) { return getIprStatusLabel(s); }
  fmt(d?: string) { return formatDate(d); }
}
