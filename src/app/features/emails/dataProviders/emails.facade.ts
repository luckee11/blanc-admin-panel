import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { EmailsApi } from './emails.api';
import { EmailsStore } from './emails.store';
import { EmailMessage } from '../models/interfaces/email-message.interface';
import { EmailStatus } from '../enums/email-status.enum';
import { AUDIENCES } from '../utils/constants/email-status.constants';

@Injectable({ providedIn: 'root' })
export class EmailsFacade {
  private api = inject(EmailsApi);
  private store = inject(EmailsStore);

  readonly emails = this.store.items;
  readonly audiences = AUDIENCES;

  constructor() {
    this.load().subscribe();
  }

  load(): Observable<void> {
    return this.api.list().pipe(
      tap((items) => this.store.setAll(items)),
      map(() => undefined),
    );
  }

  save(e: EmailMessage): Observable<EmailMessage> {
    if (e.id) {
      return this.api.update(e).pipe(tap((item) => this.store.update(item)));
    }
    const { id: _, ...rest } = e;
    return this.api.create(rest).pipe(tap((item) => this.store.add(item)));
  }

  sendNow(e: EmailMessage): Observable<EmailMessage> {
    const next: EmailMessage = { ...e, status: EmailStatus.Sent, sentAt: new Date().toISOString() };
    return this.save(next);
  }

  schedule(e: EmailMessage, when: string): Observable<EmailMessage> {
    const next: EmailMessage = { ...e, status: EmailStatus.Scheduled, scheduledAt: when };
    return this.save(next);
  }

  delete(id: string): Observable<void> {
    return this.api.remove(id).pipe(tap(() => this.store.remove(id)));
  }
}
