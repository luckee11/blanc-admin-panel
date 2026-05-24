import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { RolesFacade } from '../../../dataProviders/roles.facade';
import { Role } from '../../../models/interfaces/role.interface';
import { Permission } from '../../../models/interfaces/permission.interface';
import { countGroupSelected } from '../../../utils/functions/roles.functions';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    FormsModule, ButtonModule, InputTextModule, TextareaModule,
    CheckboxModule, TagModule, AvatarModule, TooltipModule,
    ModalComponent, PageHeaderComponent, ConfirmDeleteComponent,
  ],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesPageComponent {
  private facade     = inject(RolesFacade);
  private destroyRef = inject(DestroyRef);

  roles = this.facade.roles;
  permGroups = this.facade.permissionGroups;
  totalPerms = computed(() => this.facade.permissions().length);
  selected = signal<Role | null>(null);

  constructor() {
    effect(() => {
      if (!this.selected() && this.roles().length) {
        this.selected.set(this.roles()[0]);
      }
    });
  }

  select(r: Role) { this.selected.set(r); }
  hasPerm(r: Role, pid: string) { return r.permissions.includes(pid); }
  groupSelected(r: Role, items: Permission[]) { return countGroupSelected(r, items); }
  usedIn(pid: string) { return this.roles().filter((r) => r.permissions.includes(pid)).length; }

  togglePerm(r: Role, pid: string, checked: boolean) {
    this.facade.togglePermission(r, pid, checked)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((next) => this.selected.set(next));
  }

  modal = signal<'form' | 'delete' | 'permissions' | null>(null);
  editing = signal<Role | null>(null);
  form: Role = this.empty();

  empty(): Role { return { id: '', name: '', description: '', permissions: [], users: 0, system: false }; }
  canSave() { return !!this.form.name; }

  openCreate() { this.form = this.empty(); this.editing.set(null); this.modal.set('form'); }
  openEdit(r: Role) { this.form = { ...r }; this.editing.set(r); this.modal.set('form'); }
  openDelete(r: Role) { this.editing.set(r); this.modal.set('delete'); }
  openPermissions() { this.modal.set('permissions'); }
  closeModal() { this.modal.set(null); }

  save() {
    if (!this.canSave()) return;
    if (this.editing()?.id) {
      this.facade.updateRole(this.form)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((item) => {
          if (this.selected()?.id === item.id) this.selected.set(item);
          this.closeModal();
        });
    } else {
      this.facade.createRole(this.form)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.closeModal());
    }
  }

  doDelete() {
    const r = this.editing();
    if (!r) { this.closeModal(); return; }
    this.facade.deleteRole(r.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.selected()?.id === r.id) this.selected.set(this.roles()[0] ?? null);
        this.closeModal();
      });
  }
}
