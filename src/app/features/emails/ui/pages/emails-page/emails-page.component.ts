import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { formatDateTime } from '../../../../../shared/utils/format';
import { EmailsFacade } from '../../../dataProviders/emails.facade';
import { EmailMessage } from '../../../models/interfaces/email-message.interface';
import { EmailStatus } from '../../../enums/email-status.enum';
import { SendMode } from '../../../models/types/emails.types';
import { EmailStatsComponent } from '../../widgets/email-stats/email-stats.component';
import { getEmailStatusLabel } from '../../../utils/functions/emails.functions';

@Component({
  selector: 'app-emails-page',
  standalone: true,
  imports: [
    FormsModule,
    TableModule, ButtonModule, InputTextModule, TextareaModule, SelectModule,
    TagModule, RadioButtonModule, TooltipModule, IconFieldModule, InputIconModule,
    ModalComponent, PageHeaderComponent, ConfirmDeleteComponent, EmailStatsComponent,
  ],
  templateUrl: './emails-page.component.html',
  styleUrl: './emails-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailsPageComponent {
  private facade     = inject(EmailsFacade);
  private destroyRef = inject(DestroyRef);

  audiences = this.facade.audiences;
  emails = this.facade.emails;
  globalFilter = '';

  statusOptions = [
    { label: 'Все статусы', value: '' },
    { label: 'Черновики',       value: EmailStatus.Draft },
    { label: 'Запланированные', value: EmailStatus.Scheduled },
    { label: 'Отправленные',    value: EmailStatus.Sent },
    { label: 'Ошибка',         value: EmailStatus.Failed },
  ];
  selectedStatus = '';

  modal = signal<'form' | 'view' | 'delete' | null>(null);
  editing = signal<EmailMessage | null>(null);
  form: EmailMessage = this.empty();
  audienceKey = 'all';
  sendMode: SendMode = 'now';

  empty(): EmailMessage {
    return {
      id: '', subject: '', body: '', recipients: 'Все сотрудники',
      recipientCount: 218, status: EmailStatus.Draft, author: 'Анна Соколова',
    };
  }

  canSave() { return !!(this.form.subject && this.form.body); }

  onAudienceChange() {
    const a = this.audiences.find((x) => x.value === this.audienceKey);
    if (a) { this.form.recipients = a.label; this.form.recipientCount = a.count; }
  }

  openCreate() {
    this.form = this.empty();
    this.audienceKey = 'all';
    this.sendMode = 'now';
    this.editing.set(null);
    this.modal.set('form');
  }
  openEdit(e: EmailMessage) {
    this.form = { ...e };
    const a = this.audiences.find((x) => x.label === e.recipients);
    this.audienceKey = a ? a.value : 'custom';
    this.sendMode = e.scheduledAt ? 'schedule' : 'now';
    this.editing.set(e);
    this.modal.set('form');
  }
  openView(e: EmailMessage) { this.editing.set(e); this.modal.set('view'); }
  openDelete(e: EmailMessage) { this.editing.set(e); this.modal.set('delete'); }
  closeModal() { this.modal.set(null); this.editing.set(null); }

  saveAsDraft() {
    this.form.status = EmailStatus.Draft;
    if (!this.canSave()) return;
    this.facade.save(this.form)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeModal());
  }

  send() {
    if (!this.canSave()) return;
    const op$ = this.sendMode === 'schedule' && this.form.scheduledAt
      ? this.facade.schedule(this.form, this.form.scheduledAt)
      : this.facade.sendNow(this.form);
    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closeModal());
  }

  doDelete() {
    const e = this.editing();
    if (!e) { this.closeModal(); return; }
    this.facade.delete(e.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeModal());
  }

  tagSeverity(s: EmailStatus): 'secondary' | 'info' | 'success' | 'danger' {
    const m: Record<EmailStatus, 'secondary' | 'info' | 'success' | 'danger'> = {
      [EmailStatus.Draft]: 'secondary', [EmailStatus.Scheduled]: 'info',
      [EmailStatus.Sent]: 'success', [EmailStatus.Failed]: 'danger',
    };
    return m[s] ?? 'secondary';
  }

  readonly EmailStatus = EmailStatus;
  label(s: EmailStatus) { return getEmailStatusLabel(s); }
  fmt(d?: string) { return formatDateTime(d); }
}
