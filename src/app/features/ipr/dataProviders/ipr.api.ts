import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { makeId } from '../../../shared/utils/text';
import { IprStatus } from '../enums/ipr-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskCategory } from '../enums/task-category.enum';
import {
  DevelopmentPlanDetail,
  DevelopmentPlanListItem,
  DevelopmentPlansSearchResponse,
  IprPlan,
  SearchDevelopmentPlansRequest,
} from '../models/interfaces/ipr-plan.interface';
import { IprTask } from '../models/interfaces/ipr-task.interface';

const SEED_PLANS: IprPlan[] = [
  { id: makeId(), employeeName: 'Дмитрий Орлов', position: 'Старший разработчик', period: '2026 H1', goal: 'Тимлид внутри платформы self-портала', status: IprStatus.InProgress, progress: 65, tasksTotal: 8, tasksDone: 5, mentor: 'Сергей Беляев', startDate: '2026-01-15', endDate: '2026-06-30' },
  { id: makeId(), employeeName: 'Мария Лебедева', position: 'Дизайнер', period: '2026 H1', goal: 'Освоение Design System и Figma Tokens', status: IprStatus.InProgress, progress: 40, tasksTotal: 6, tasksDone: 2, mentor: 'Ольга Сергеева', startDate: '2026-02-01', endDate: '2026-07-01' },
  { id: makeId(), employeeName: 'Никита Семенов', position: 'DevOps инженер', period: '2026 H1', goal: 'Сертификация AWS Solutions Architect', status: IprStatus.OnReview, progress: 90, tasksTotal: 5, tasksDone: 5, mentor: 'Сергей Беляев', startDate: '2026-01-10', endDate: '2026-06-10' },
  { id: makeId(), employeeName: 'Игорь Захаров', position: 'Финансовый аналитик', period: '2025 H2', goal: 'Развитие в направлении FP&A', status: IprStatus.Completed, progress: 100, tasksTotal: 7, tasksDone: 7, mentor: 'Елена Кузьмина', startDate: '2025-07-01', endDate: '2025-12-31' },
  { id: makeId(), employeeName: 'Анна Соколова', position: 'HRBP', period: '2026 H1', goal: 'Внедрение OKR в HR', status: IprStatus.Draft, progress: 0, tasksTotal: 4, tasksDone: 0, mentor: 'Илья Громов', startDate: '2026-04-01', endDate: '2026-09-30' },
];

const SEED_TASKS: IprTask[] = [
  { id: makeId(), planId: '1', employeeName: 'Дмитрий Орлов', title: 'Пройти курс «Team Lead Foundations»', category: TaskCategory.Training, priority: TaskPriority.High, status: IprStatus.Completed, dueDate: '2026-03-30', description: 'Платформа Stratoplan, 40 часов' },
  { id: makeId(), planId: '1', employeeName: 'Дмитрий Орлов', title: 'Менторинг 2 джунов', category: TaskCategory.Mentorship, priority: TaskPriority.Medium, status: IprStatus.InProgress, dueDate: '2026-06-30' },
  { id: makeId(), planId: '2', employeeName: 'Мария Лебедева', title: 'Спроектировать токены DS v2', category: TaskCategory.Project, priority: TaskPriority.High, status: IprStatus.InProgress, dueDate: '2026-05-31' },
  { id: makeId(), planId: '3', employeeName: 'Никита Семенов', title: 'Экзамен AWS SAA-C03', category: TaskCategory.Certification, priority: TaskPriority.High, status: IprStatus.OnReview, dueDate: '2026-05-25' },
  { id: makeId(), planId: '2', employeeName: 'Мария Лебедева', title: 'Книга «Refactoring UI»', category: TaskCategory.Reading, priority: TaskPriority.Low, status: IprStatus.Draft, dueDate: '2026-07-01' },
  { id: makeId(), planId: '1', employeeName: 'Дмитрий Орлов', title: 'Декомпозиция эпика «Self-портал v3»', category: TaskCategory.Project, priority: TaskPriority.High, status: IprStatus.Overdue, dueDate: '2026-05-10' },
];

@Injectable({ providedIn: 'root' })
export class IprApi {
  private http = inject(HttpClient);

  /** POST /api/admin/development-plans/search — поиск планов развития с пагинацией. */
  searchDevelopmentPlans(
    req: SearchDevelopmentPlansRequest,
  ): Observable<DevelopmentPlansSearchResponse> {
    return this.http.post<DevelopmentPlansSearchResponse>(
      '/api/admin/development-plans/search',
      req,
    );
  }

  /** GET /api/admin/development-plans/recent — последние планы развития (по умолчанию 5). */
  getRecentDevelopmentPlans(limit = 5): Observable<DevelopmentPlanListItem[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<DevelopmentPlanListItem[]>('/api/admin/development-plans/recent', { params });
  }

  /** GET /api/admin/development-plans/{id} — детальный план развития (с пунктами). */
  getDevelopmentPlanById(id: string): Observable<DevelopmentPlanDetail> {
    return this.http.get<DevelopmentPlanDetail>(`/api/admin/development-plans/${id}`);
  }

  /** DELETE /api/admin/development-plans/{id} — удаление плана развития. */
  deleteDevelopmentPlan(id: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/development-plans/${id}`);
  }

  listPlans(): Observable<IprPlan[]> { return of(SEED_PLANS); }
  createPlan(p: Omit<IprPlan, 'id'>): Observable<IprPlan> { return of({ ...p, id: makeId() }); }
  updatePlan(p: IprPlan): Observable<IprPlan> { return of(p); }
  deletePlan(_id: string): Observable<void> { return of(undefined); }

  listTasks(): Observable<IprTask[]> { return of(SEED_TASKS); }
  createTask(t: Omit<IprTask, 'id'>): Observable<IprTask> { return of({ ...t, id: makeId() }); }
  updateTask(t: IprTask): Observable<IprTask> { return of(t); }
  deleteTask(_id: string): Observable<void> { return of(undefined); }
}
