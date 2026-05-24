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
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { formatDate } from '../../../../../shared/utils/format';
import { initialsOf } from '../../../../../shared/utils/text';
import { IprFacade } from '../../../dataProviders/ipr.facade';
import { IprTask } from '../../../models/interfaces/ipr-task.interface';
import { IprStatus } from '../../../enums/ipr-status.enum';
import { TaskPriority } from '../../../enums/task-priority.enum';
import { TaskCategory } from '../../../enums/task-category.enum';
import { getIprStatusLabel, getPriorityLabel, getCategoryLabel } from '../../../utils/functions/ipr.functions';

@Component({
  selector: 'app-ipr-tasks',
  standalone: true,
  imports: [
    FormsModule,
    TableModule, ButtonModule, InputTextModule, TextareaModule, SelectModule,
    TagModule, AvatarModule, TooltipModule, IconFieldModule, InputIconModule,
    ModalComponent, PageHeaderComponent, ConfirmDeleteComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {
  private facade     = inject(IprFacade);
  private destroyRef = inject(DestroyRef);

  tasks = this.facade.tasks;
  globalFilter = '';

  statusOptions = [
    { label: 'Все статусы', value: '' },
    { label: 'Черновик',   value: IprStatus.Draft },
    { label: 'В работе',   value: IprStatus.InProgress },
    { label: 'На ревью',   value: IprStatus.OnReview },
    { label: 'Завершён',   value: IprStatus.Completed },
    { label: 'Просрочен',  value: IprStatus.Overdue },
  ];
  selectedStatus = '';

  priorityOptions = [
    { label: 'Любой приоритет', value: '' },
    { label: 'Высокий', value: TaskPriority.High },
    { label: 'Средний', value: TaskPriority.Medium },
    { label: 'Низкий',  value: TaskPriority.Low },
  ];
  selectedPriority = '';

  statusFormOpts   = this.statusOptions.slice(1);
  priorityFormOpts = this.priorityOptions.slice(1);
  categoryFormOpts = [
    { label: 'Обучение',       value: TaskCategory.Training },
    { label: 'Проект',         value: TaskCategory.Project },
    { label: 'Менторинг',      value: TaskCategory.Mentorship },
    { label: 'Сертификация',   value: TaskCategory.Certification },
    { label: 'Литература',     value: TaskCategory.Reading },
  ];

  modal = signal<'form' | 'delete' | null>(null);
  editing = signal<IprTask | null>(null);
  form: IprTask = this.empty();

  empty(): IprTask {
    return {
      id: '', planId: '', employeeName: '', title: '', description: '',
      category: TaskCategory.Training, priority: TaskPriority.Medium,
      status: IprStatus.Draft,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    };
  }

  canSave() { return !!(this.form.title && this.form.employeeName); }

  openCreate() { this.form = this.empty(); this.editing.set(null); this.modal.set('form'); }
  openEdit(t: IprTask) { this.form = { ...t }; this.editing.set(t); this.modal.set('form'); }
  openDelete(t: IprTask) { this.editing.set(t); this.modal.set('delete'); }
  closeModal() { this.modal.set(null); this.editing.set(null); }

  save() {
    if (!this.canSave()) return;
    const op$ = this.editing()?.id
      ? this.facade.updateTask(this.form)
      : this.facade.createTask(this.form);
    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closeModal());
  }

  doDelete() {
    const t = this.editing();
    if (!t) { this.closeModal(); return; }
    this.facade.deleteTask(t.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeModal());
  }

  statusSeverity(s: IprStatus): 'secondary' | 'info' | 'warn' | 'success' | 'danger' {
    const m: Record<IprStatus, 'secondary' | 'info' | 'warn' | 'success' | 'danger'> = {
      [IprStatus.Draft]: 'secondary', [IprStatus.InProgress]: 'info',
      [IprStatus.OnReview]: 'warn', [IprStatus.Completed]: 'success', [IprStatus.Overdue]: 'danger',
    };
    return m[s] ?? 'secondary';
  }
  prioritySeverity(p: TaskPriority): 'danger' | 'warn' | 'secondary' {
    if (p === TaskPriority.High) return 'danger';
    if (p === TaskPriority.Medium) return 'warn';
    return 'secondary';
  }

  ini(n: string) { return initialsOf(n); }
  label(s: IprStatus) { return getIprStatusLabel(s); }
  pLabel(p: TaskPriority) { return getPriorityLabel(p); }
  catLabel(c: TaskCategory) { return getCategoryLabel(c); }
  fmt(d?: string) { return formatDate(d); }
}
