import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { makeId } from '../../../shared/utils/text';
import { NewsItem } from '../models/interfaces/news-item.interface';
import { NewsStatus } from '../enums/news-status.enum';

const SEED: NewsItem[] = [
  { id: makeId(), title: 'Запуск нового self-портала Blanc для сотрудников', category: 'Продукт', excerpt: 'Открыли доступ к новому интерфейсу для всех сотрудников банка.', body: 'Сегодня мы запускаем обновлённый self-портал. В нём собраны заявки, отпуска, ИПР и обучение в одном месте.', status: NewsStatus.Published, author: 'Анна Соколова', publishDate: '2026-05-18', views: 412, pinned: true },
  { id: makeId(), title: 'Обновление политики оформления отпуска', category: 'HR', excerpt: 'Изменили сроки согласования заявлений на отпуск.', body: 'С 1 июня заявления на отпуск необходимо подавать минимум за 14 календарных дней.', status: NewsStatus.Published, author: 'Илья Громов', publishDate: '2026-05-15', views: 268 },
  { id: makeId(), title: 'Корпоративный митап «AI in Banking»', category: 'События', excerpt: 'Делимся опытом внедрения AI в продуктах банка.', body: '20 июня в офисе на Тверской пройдёт митап про AI в банковских продуктах.', status: NewsStatus.Scheduled, author: 'Мария Лебедева', publishDate: '2026-05-25' },
  { id: makeId(), title: 'Программа ИПР: что нового в 2026', category: 'Развитие', excerpt: 'Анонс новой методологии и инструментов планирования развития.', body: 'В 2026 году мы обновили шаблоны ИПР и добавили библиотеку курсов.', status: NewsStatus.Draft, author: 'Анна Соколова', publishDate: '2026-05-22' },
];

@Injectable({ providedIn: 'root' })
export class NewsApi {
  list(): Observable<NewsItem[]> { return of(SEED); }
  create(n: Omit<NewsItem, 'id'>): Observable<NewsItem> { return of({ ...n, id: makeId() }); }
  update(n: NewsItem): Observable<NewsItem> { return of(n); }
  remove(_id: string): Observable<void> { return of(undefined); }
}
