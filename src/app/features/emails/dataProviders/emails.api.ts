import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { makeId } from '../../../shared/utils/text';
import { EmailMessage } from '../models/interfaces/email-message.interface';
import { EmailTemplate } from '../models/interfaces/email-template.interface';
import { EmailStatus } from '../enums/email-status.enum';

const SEED: EmailMessage[] = [
  { id: makeId(), subject: 'Добро пожаловать в Blanc!', body: 'Здравствуйте! Рады приветствовать вас в команде Blanc...', recipients: 'Новые сотрудники (probation)', recipientCount: 9, status: EmailStatus.Sent, sentAt: '2026-05-15T10:00:00', author: 'Анна Соколова', template: 'Онбординг' },
  { id: makeId(), subject: 'Анонс митапа AI in Banking', body: 'Уважаемые коллеги, приглашаем вас на митап...', recipients: 'Все сотрудники', recipientCount: 218, status: EmailStatus.Scheduled, scheduledAt: '2026-05-25T09:00:00', author: 'Мария Лебедева' },
  { id: makeId(), subject: 'Напоминание: пройдите опрос вовлечённости', body: 'У вас есть ещё неделя, чтобы пройти опрос...', recipients: 'Все сотрудники', recipientCount: 218, status: EmailStatus.Sent, sentAt: '2026-05-20T08:30:00', author: 'Илья Громов' },
  { id: makeId(), subject: 'Изменения в политике отпусков', body: 'Сообщаем об изменениях в порядке оформления отпусков...', recipients: 'Все сотрудники', recipientCount: 218, status: EmailStatus.Draft, author: 'Анна Соколова' },
  { id: makeId(), subject: 'Сертификация: открыта запись', body: 'Открыта запись на летние программы сертификации...', recipients: 'Отдел IT', recipientCount: 64, status: EmailStatus.Sent, sentAt: '2026-05-12T11:15:00', author: 'Сергей Беляев' },
];

@Injectable({ providedIn: 'root' })
export class EmailsApi {
  private http = inject(HttpClient);

  list(): Observable<EmailMessage[]> { return of(SEED); }
  create(e: Omit<EmailMessage, 'id'>): Observable<EmailMessage> { return of({ ...e, id: makeId() }); }
  update(e: EmailMessage): Observable<EmailMessage> { return of(e); }
  remove(_id: string): Observable<void> { return of(undefined); }

  /* ===== Шаблоны писем ===== */
  /** GET /api/admin/emails — шаблоны писем. */
  listTemplates(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>('/api/admin/emails');
  }

  /** POST /api/admin/emails — создание шаблона письма. */
  createTemplate(t: Omit<EmailTemplate, 'id'>): Observable<EmailTemplate> {
    return this.http.post<EmailTemplate>('/api/admin/emails', t);
  }

  /** DELETE /api/admin/emails/{id} — удаление шаблона письма. */
  removeTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/emails/${id}`);
  }
}
