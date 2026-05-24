import { Injectable, signal } from '@angular/core';
import {
  DevelopmentPlanDetail,
  DevelopmentPlanListItem,
  DevelopmentPlansSearchResponse,
  IprPlan,
} from '../models/interfaces/ipr-plan.interface';
import {
  DevelopmentPlanGroupDetailAnalytics,
  DevelopmentPlansAnalytics,
} from '../models/interfaces/development-plan-analytics.interface';
import { IprTask } from '../models/interfaces/ipr-task.interface';

export interface DevelopmentPlansPagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({ providedIn: 'root' })
export class IprStore {
  private _plans = signal<IprPlan[]>([]);
  readonly plans = this._plans.asReadonly();

  /** Реальные планы развития с бэкенда (GET-страница /api/admin/development-plans/search). */
  private _developmentPlans = signal<DevelopmentPlanListItem[]>([]);
  readonly developmentPlans = this._developmentPlans.asReadonly();

  /** Последние планы развития (GET /api/admin/development-plans/recent). */
  private _recentDevelopmentPlans = signal<DevelopmentPlanListItem[]>([]);
  readonly recentDevelopmentPlans = this._recentDevelopmentPlans.asReadonly();
  setRecentDevelopmentPlans(items: DevelopmentPlanListItem[]) { this._recentDevelopmentPlans.set(items); }

  /** Аналитика планов развития (GET /api/admin/development-plans/analytics). */
  private _analytics = signal<DevelopmentPlansAnalytics | null>(null);
  readonly analytics = this._analytics.asReadonly();
  setAnalytics(data: DevelopmentPlansAnalytics) { this._analytics.set(data); }

  /** Аналитика по группе (GET /api/admin/development-plans/analytics/group/{id}). */
  private _groupAnalytics = signal<DevelopmentPlanGroupDetailAnalytics | null>(null);
  readonly groupAnalytics = this._groupAnalytics.asReadonly();
  setGroupAnalytics(data: DevelopmentPlanGroupDetailAnalytics) { this._groupAnalytics.set(data); }
  clearGroupAnalytics() { this._groupAnalytics.set(null); }

  private _plansPagination = signal<DevelopmentPlansPagination | null>(null);
  readonly plansPagination = this._plansPagination.asReadonly();

  /** Выбранный план развития (детальная страница). */
  private _selectedPlan = signal<DevelopmentPlanDetail | null>(null);
  readonly selectedPlan = this._selectedPlan.asReadonly();

  private _selectedPlanLoading = signal(false);
  readonly selectedPlanLoading = this._selectedPlanLoading.asReadonly();

  setSelectedPlan(p: DevelopmentPlanDetail) { this._selectedPlan.set(p); }
  setSelectedPlanLoading(v: boolean) { this._selectedPlanLoading.set(v); }
  clearSelectedPlan() { this._selectedPlan.set(null); }

  private _tasks = signal<IprTask[]>([]);
  readonly tasks = this._tasks.asReadonly();

  setPlans(items: IprPlan[]) { this._plans.set(items); }

  /** Записать страницу планов развития из ответа /api/admin/development-plans/search. */
  setDevelopmentPlans(res: DevelopmentPlansSearchResponse) {
    this._developmentPlans.set(res.data);
    this._plansPagination.set({
      currentPage:     res.currentPage,
      pageSize:        res.pageSize,
      totalCount:      res.totalCount,
      totalPages:      res.totalPages,
      hasNextPage:     res.hasNextPage,
      hasPreviousPage: res.hasPreviousPage,
    });
  }

  /** Убрать план развития из загруженной страницы (после удаления на бэке). */
  removeDevelopmentPlan(id: string) {
    this._developmentPlans.update((l) => l.filter((p) => p.id !== id));
  }
  addPlan(p: IprPlan) { this._plans.update((l) => [p, ...l]); }
  updatePlan(p: IprPlan) { this._plans.update((l) => l.map((x) => x.id === p.id ? p : x)); }
  removePlan(id: string) { this._plans.update((l) => l.filter((x) => x.id !== id)); }

  setTasks(items: IprTask[]) { this._tasks.set(items); }
  addTask(t: IprTask) { this._tasks.update((l) => [t, ...l]); }
  updateTask(t: IprTask) { this._tasks.update((l) => l.map((x) => x.id === t.id ? t : x)); }
  removeTask(id: string) { this._tasks.update((l) => l.filter((x) => x.id !== id)); }
}
