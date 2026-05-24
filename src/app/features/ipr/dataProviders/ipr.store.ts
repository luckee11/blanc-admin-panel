import { Injectable, signal } from '@angular/core';
import {
  DevelopmentPlanDetail,
  DevelopmentPlanListItem,
  DevelopmentPlansSearchResponse,
  IprPlan,
} from '../models/interfaces/ipr-plan.interface';
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
