import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { formatDateTime } from '../../../../../shared/utils/format';
import { initialsOf } from '../../../../../shared/utils/text';
import { EmployeesFacade } from '../../../dataProviders/employees.facade';
import { ADUser } from '../../../models/interfaces/ad-user.interface';

@Component({
  selector: 'app-ad-users',
  standalone: true,
  imports: [
    FormsModule,
    TableModule, ButtonModule, InputTextModule, SelectModule,
    TagModule, AvatarModule, CheckboxModule, TooltipModule,
    IconFieldModule, InputIconModule,
    ModalComponent, PageHeaderComponent, ConfirmDeleteComponent,
  ],
  templateUrl: './ad-users.component.html',
  styleUrl: './ad-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ADUsersComponent {
  private facade     = inject(EmployeesFacade);
  private destroyRef = inject(DestroyRef);

  users = this.facade.adUsers;
  globalFilter = '';

  statusOptions = [
    { label: 'Все статусы', value: '' },
    { label: 'Активные', value: '1' },
    { label: 'Заблокированные', value: '0' },
  ];
  selectedStatus = '';

  modal = signal<'form' | 'view' | 'delete' | null>(null);
  editing = signal<ADUser | null>(null);
  form: ADUser = this.empty();
  groupsText = '';

  empty(): ADUser {
    return {
      id: '', login: '', displayName: '', email: '',
      ou: 'OU=Users,DC=blanc,DC=bank',
      lastLogin: new Date().toISOString().slice(0, 16),
      enabled: true, groups: [],
    };
  }

  canSave() { return !!(this.form.login && this.form.displayName && this.form.email); }

  openCreate() { this.form = this.empty(); this.groupsText = ''; this.editing.set(null); this.modal.set('form'); }
  openEdit(u: ADUser) { this.form = { ...u }; this.groupsText = u.groups.join(', '); this.editing.set(u); this.modal.set('form'); }
  openView(u: ADUser) { this.editing.set(u); this.modal.set('view'); }
  openDelete(u: ADUser) { this.editing.set(u); this.modal.set('delete'); }
  closeModal() { this.modal.set(null); this.editing.set(null); }

  save() {
    if (!this.canSave()) return;
    this.form.groups = this.groupsText.split(',').map((s) => s.trim()).filter(Boolean);
    const op$ = this.editing()?.id
      ? this.facade.updateADUser(this.form)
      : this.facade.createADUser(this.form);
    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closeModal());
  }

  doDelete() {
    const u = this.editing();
    if (!u) { this.closeModal(); return; }
    this.facade.deleteADUser(u.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeModal());
  }

  ini(n: string) { return initialsOf(n); }
  fmt(d?: string) { return formatDateTime(d); }
}
