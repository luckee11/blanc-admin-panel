import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { SurveysApi } from './surveys.api';
import { SurveysStore } from './surveys.store';
import { Survey } from '../models/interfaces/survey.interface';

@Injectable({ providedIn: 'root' })
export class SurveysFacade {
  private api = inject(SurveysApi);
  private store = inject(SurveysStore);

  readonly surveys = this.store.items;

  constructor() {
    this.load().subscribe();
  }

  load(): Observable<void> {
    return this.api.list().pipe(
      tap((items) => this.store.setAll(items)),
      map(() => undefined),
    );
  }

  create(s: Omit<Survey, 'id'>): Observable<Survey> {
    return this.api.create(s).pipe(tap((item) => this.store.add(item)));
  }

  update(s: Survey): Observable<Survey> {
    return this.api.update(s).pipe(tap((item) => this.store.update(item)));
  }

  delete(id: string): Observable<void> {
    return this.api.remove(id).pipe(tap(() => this.store.remove(id)));
  }
}
