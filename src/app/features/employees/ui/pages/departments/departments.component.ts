import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { initialsOf } from '../../../../../shared/utils/text';
import { EmployeesFacade } from '../../../dataProviders/employees.facade';
import { Department } from '../../../models/interfaces/department.interface';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    FormsModule, ButtonModule, InputTextModule, TextareaModule,
    AvatarModule, TooltipModule,
    ModalComponent, PageHeaderComponent, ConfirmDeleteComponent,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsComponent {
  private facade     = inject(EmployeesFacade);
  private destroyRef = inject(DestroyRef);

  departments = this.facade.departments;
  filtered = computed(() => this.departments());

  modal = signal<'form' | 'view' | 'delete' | null>(null);
  editing = signal<Department | null>(null);
  form: Department = this.empty();

  empty(): Department {
    return { id: '', name: '', code: '', head: '', headcount: 0, parent: '', description: '' };
  }

  canSave() { return !!(this.form.name && this.form.code && this.form.head); }

  openCreate() { this.form = this.empty(); this.editing.set(null); this.modal.set('form'); }
  openEdit(d: Department) { this.form = { ...d }; this.editing.set(d); this.modal.set('form'); }
  openView(d: Department) { this.editing.set(d); this.modal.set('view'); }
  openDelete(d: Department) { this.editing.set(d); this.modal.set('delete'); }
  closeModal() { this.modal.set(null); this.editing.set(null); }

  save() {
    if (!this.canSave()) return;
    this.form.headcount = Number(this.form.headcount) || 0;
    const op$ = this.editing()?.id
      ? this.facade.updateDepartment(this.form)
      : this.facade.createDepartment(this.form);
    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closeModal());
  }

  doDelete() {
    const d = this.editing();
    if (!d) { this.closeModal(); return; }
    this.facade.deleteDepartment(d.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeModal());
  }

  ini(n: string) { return initialsOf(n); }
}
