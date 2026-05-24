import { Injectable, signal } from '@angular/core';
import { NewsItem } from '../models/interfaces/news-item.interface';

@Injectable({ providedIn: 'root' })
export class NewsStore {
  private _items = signal<NewsItem[]>([]);
  readonly items = this._items.asReadonly();

  setAll(items: NewsItem[]) { this._items.set(items); }
  add(n: NewsItem) { this._items.update((l) => [n, ...l]); }
  update(n: NewsItem) { this._items.update((l) => l.map((x) => x.id === n.id ? n : x)); }
  remove(id: string) { this._items.update((l) => l.filter((x) => x.id !== id)); }
}
