import { Injectable, signal } from '@angular/core';
import { Survey } from '../models/interfaces/survey.interface';

@Injectable({ providedIn: 'root' })
export class SurveysStore {
  private _items = signal<Survey[]>([]);
  readonly items = this._items.asReadonly();

  setAll(items: Survey[]) { this._items.set(items); }
  add(s: Survey) { this._items.update((l) => [s, ...l]); }
  update(s: Survey) { this._items.update((l) => l.map((x) => x.id === s.id ? s : x)); }
  remove(id: string) { this._items.update((l) => l.filter((x) => x.id !== id)); }
}
