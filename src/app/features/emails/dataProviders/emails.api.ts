import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { makeId } from '../../../shared/utils/text';
import { EmailMessage } from '../models/interfaces/email-message.interface';
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
  list(): Observable<EmailMessage[]> { return of(SEED); }
  create(e: Omit<EmailMessage, 'id'>): Observable<EmailMessage> { return of({ ...e, id: makeId() }); }
  update(e: EmailMessage): Observable<EmailMessage> { return of(e); }
  remove(_id: string): Observable<void> { return of(undefined); }
}
