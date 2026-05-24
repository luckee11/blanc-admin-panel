import { Injectable, signal } from '@angular/core';
import { EmailMessage } from '../models/interfaces/email-message.interface';

@Injectable({ providedIn: 'root' })
export class EmailsStore {
  private _items = signal<EmailMessage[]>([]);
  readonly items = this._items.asReadonly();

  setAll(items: EmailMessage[]) { this._items.set(items); }
  add(e: EmailMessage) { this._items.update((l) => [e, ...l]); }
  update(e: EmailMessage) { this._items.update((l) => l.map((x) => x.id === e.id ? e : x)); }
  remove(id: string) { this._items.update((l) => l.filter((x) => x.id !== id)); }
}
