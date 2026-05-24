import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { makeId } from '../../../shared/utils/text';
import { Survey } from '../models/interfaces/survey.interface';
import { SurveyStatus } from '../enums/survey-status.enum';

const SEED: Survey[] = [
  { id: makeId(), title: 'Вовлечённость Q2 2026', description: 'Ежеквартальный опрос вовлечённости и eNPS', status: SurveyStatus.Active, audience: 'Все сотрудники', questions: 24, responses: 142, totalRecipients: 218, startDate: '2026-05-10', endDate: '2026-05-31' },
  { id: makeId(), title: 'Оценка онбординга', description: 'Для сотрудников на испытательном сроке', status: SurveyStatus.Active, audience: 'Probation', questions: 12, responses: 4, totalRecipients: 9, startDate: '2026-05-01', endDate: '2026-06-30' },
  { id: makeId(), title: 'Опрос «360°» по руководителям', description: 'Кросс-оценка лидеров', status: SurveyStatus.Draft, audience: 'Руководители', questions: 30, responses: 0, totalRecipients: 45, startDate: '2026-06-01', endDate: '2026-06-21' },
  { id: makeId(), title: 'Удовлетворённость HR-сервисами', description: 'Анонимный опрос', status: SurveyStatus.Completed, audience: 'Все сотрудники', questions: 10, responses: 198, totalRecipients: 215, startDate: '2026-02-01', endDate: '2026-02-28' },
];

@Injectable({ providedIn: 'root' })
export class SurveysApi {
  list(): Observable<Survey[]> { return of(SEED); }
  create(s: Omit<Survey, 'id'>): Observable<Survey> { return of({ ...s, id: makeId() }); }
  update(s: Survey): Observable<Survey> { return of(s); }
  remove(_id: string): Observable<void> { return of(undefined); }
}
