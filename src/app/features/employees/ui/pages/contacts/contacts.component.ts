import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { initialsOf } from '../../../../../shared/utils/text';
import { EmployeesFacade } from '../../../dataProviders/employees.facade';
import { Contact } from '../../../models/interfaces/contact.interface';
import { ContactType } from '../../../enums/contact-type.enum';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    FormsModule, TableModule, ButtonModule, InputTextModule, SelectModule,
    TagModule, AvatarModule, TooltipModule, IconFieldModule, InputIconModule,
    ModalComponent, PageHeaderComponent, ConfirmDeleteComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent {
  private facade     = inject(EmployeesFacade);
  private destroyRef = inject(DestroyRef);

  contacts = this.facade.contacts;
  globalFilter = '';

  typeOptions = [
    { label: 'Все типы', value: '' },
    { label: 'Внутренний', value: ContactType.Internal },
    { label: 'Внешний',    value: ContactType.External },
    { label: 'Партнёр',    value: ContactType.Partner },
  ];
  selectedType = '';

  typeFormOptions = [
    { label: 'Внутренний', value: ContactType.Internal },
    { label: 'Внешний',    value: ContactType.External },
    { label: 'Партнёр',    value: ContactType.Partner },
  ];

  modal = signal<'form' | 'delete' | null>(null);
  editing = signal<Contact | null>(null);
  form: Contact = this.empty();

  empty(): Contact {
    return { id: '', name: '', position: '', email: '', phone: '', department: '', type: ContactType.Internal };
  }

  canSave() { return !!(this.form.name && this.form.email); }

  openCreate() { this.form = this.empty(); this.editing.set(null); this.modal.set('form'); }
  openEdit(c: Contact) { this.form = { ...c }; this.editing.set(c); this.modal.set('form'); }
  openDelete(c: Contact) { this.editing.set(c); this.modal.set('delete'); }
  closeModal() { this.modal.set(null); this.editing.set(null); }

  save() {
    if (!this.canSave()) return;
    const op$ = this.editing()?.id
      ? this.facade.updateContact(this.form)
      : this.facade.createContact(this.form);
    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closeModal());
  }

  doDelete() {
    const c = this.editing();
    if (!c) { this.closeModal(); return; }
    this.facade.deleteContact(c.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeModal());
  }

  ini(n: string) { return initialsOf(n); }

  tagSeverity(t: ContactType): 'info' | 'warn' | 'secondary' {
    return { [ContactType.Internal]: 'info', [ContactType.External]: 'secondary', [ContactType.Partner]: 'warn' }[t] as 'info' | 'warn' | 'secondary';
  }
  typeLabel(t: ContactType) {
    return { [ContactType.Internal]: 'Внутренний', [ContactType.External]: 'Внешний', [ContactType.Partner]: 'Партнёр' }[t];
  }
}
