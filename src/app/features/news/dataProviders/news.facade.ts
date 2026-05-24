import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { NewsApi } from './news.api';
import { NewsStore } from './news.store';
import { NewsItem } from '../models/interfaces/news-item.interface';

@Injectable({ providedIn: 'root' })
export class NewsFacade {
  private api = inject(NewsApi);
  private store = inject(NewsStore);

  readonly news = this.store.items;

  constructor() {
    this.load().subscribe();
  }

  load(): Observable<void> {
    return this.api.list().pipe(
      tap((items) => this.store.setAll(items)),
      map(() => undefined),
    );
  }

  create(n: Omit<NewsItem, 'id'>): Observable<NewsItem> {
    return this.api.create(n).pipe(tap((item) => this.store.add(item)));
  }

  update(n: NewsItem): Observable<NewsItem> {
    return this.api.update(n).pipe(tap((item) => this.store.update(item)));
  }

  delete(id: string): Observable<void> {
    return this.api.remove(id).pipe(tap(() => this.store.remove(id)));
  }
}
