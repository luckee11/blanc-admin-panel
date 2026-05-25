import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { EmailsFacade } from '../../../dataProviders/emails.facade';
import { EmailStatus } from '../../../enums/email-status.enum';
import { SendMode } from '../../../models/types/emails.types';
import { EmployeesFacade } from '../../../../employees/dataProviders/employees.facade';

const ALL = 'all';

@Component({
  selector: 'app-email-compose',
  standalone: true,
  imports: [FormsModule, ButtonModule, SelectModule, InputTextModule, RadioButtonModule, PageHeaderComponent],
  templateUrl: './compose.component.html',
  styleUrl: './compose.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposeComponent implements OnInit {
  private facade        = inject(EmailsFacade);
  private employeesF    = inject(EmployeesFacade);
  private router        = inject(Router);
  private toast         = inject(ToastService);
  private destroyRef    = inject(DestroyRef);

  templates = this.facade.templates;
  squads    = this.employeesF.squads;

  selectedTemplateId = signal<string | null>(null);
  selectedAudience   = signal<string>(ALL);
  sendMode: SendMode = 'now';
  scheduledAt = '';
  sending = signal(false);

  readonly selectedTemplate = computed(() =>
    this.templates().find((t) => t.id === this.selectedTemplateId()) ?? null,
  );

  /** Опции аудитории: «Все сотрудники» + каждый отдел/сквад. */
  readonly audienceOptions = computed(() => {
    const total = this.squads().reduce((sum, s) => sum + (s.employeeCount ?? 0), 0);
    return [
      { label: 'Все сотрудники', value: ALL, count: total },
      ...this.squads().map((s) => ({ label: s.name, value: s.id, count: s.employeeCount })),
    ];
  });

  readonly selectedAudienceOption = computed(() =>
    this.audienceOptions().find((a) => a.value === this.selectedAudience()) ?? null,
  );

  ngOnInit(): void {
    this.employeesF.loadSquads()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  back(): void {
    this.router.navigate(['/emails']);
  }

  canSend(): boolean {
    if (!this.selectedTemplate() || !this.selectedAudienceOption()) return false;
    if (this.sendMode === 'schedule' && !this.scheduledAt) return false;
    return true;
  }

  send(): void {
    const t = this.selectedTemplate();
    const aud = this.selectedAudienceOption();
    if (!t || !aud || !this.canSend()) return;

    const message = {
      id: '',
      subject: t.subject,
      body: t.body,
      recipients: aud.label,
      recipientCount: aud.count,
      status: EmailStatus.Draft,
      author: 'Анна Соколова',
      template: t.name,
    };

    const scheduled = this.sendMode === 'schedule';
    this.sending.set(true);
    const op$ = scheduled
      ? this.facade.schedule(message, this.scheduledAt)
      : this.facade.sendNow(message);

    op$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success(
            scheduled ? 'Письмо запланировано' : 'Письмо отправлено',
            `${aud.label} · ${aud.count} получателей`,
          );
          this.router.navigate(['/emails']);
        },
        error: () => {
          this.sending.set(false);
          this.toast.error(
            scheduled ? 'Не удалось запланировать письмо' : 'Не удалось отправить письмо',
            'Попробуйте ещё раз',
          );
        },
      });
  }
}
