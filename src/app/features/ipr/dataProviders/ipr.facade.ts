import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, forkJoin, map, tap } from 'rxjs';
import { IprApi } from './ipr.api';
import { IprStore } from './ipr.store';
import {
  IprPlan,
  SearchDevelopmentPlansRequest,
} from '../models/interfaces/ipr-plan.interface';
import { IprTask } from '../models/interfaces/ipr-task.interface';

@Injectable({ providedIn: 'root' })
export class IprFacade {
  private api = inject(IprApi);
  private store = inject(IprStore);

  readonly plans = this.store.plans;
  readonly developmentPlans = this.store.developmentPlans;
  readonly recentDevelopmentPlans = this.store.recentDevelopmentPlans;
  readonly plansPagination = this.store.plansPagination;
  readonly selectedPlan = this.store.selectedPlan;
  readonly selectedPlanLoading = this.store.selectedPlanLoading;
  readonly tasks = this.store.tasks;

  private _plansLoading = signal(false);
  readonly plansLoading = this._plansLoading.asReadonly();

  private _recentPlansLoading = signal(false);
  readonly recentPlansLoading = this._recentPlansLoading.asReadonly();

  readonly analytics = this.store.analytics;
  private _analyticsLoading = signal(false);
  readonly analyticsLoading = this._analyticsLoading.asReadonly();

  readonly groupAnalytics = this.store.groupAnalytics;
  private _groupAnalyticsLoading = signal(false);
  readonly groupAnalyticsLoading = this._groupAnalyticsLoading.asReadonly();

  constructor() {
    this.loadAll().subscribe();
  }

  /** Загрузка планов развития с бэкенда (POST /api/admin/development-plans/search). */
  searchDevelopmentPlans(req: SearchDevelopmentPlansRequest = {}): Observable<void> {
    this._plansLoading.set(true);
    return this.api.searchDevelopmentPlans(req).pipe(
      tap((res) => this.store.setDevelopmentPlans(res)),
      finalize(() => this._plansLoading.set(false)),
      map(() => undefined),
    );
  }

  /** Загрузка аналитики планов развития (GET /api/admin/development-plans/analytics). */
  loadDevelopmentPlansAnalytics(): Observable<void> {
    this._analyticsLoading.set(true);
    return this.api.getDevelopmentPlansAnalytics().pipe(
      tap((data) => this.store.setAnalytics(data)),
      finalize(() => this._analyticsLoading.set(false)),
      map(() => undefined),
    );
  }

  /** Загрузка аналитики по группе (GET /api/admin/development-plans/analytics/group/{id}). */
  loadGroupAnalytics(groupId: string): Observable<void> {
    this._groupAnalyticsLoading.set(true);
    return this.api.getGroupAnalytics(groupId).pipe(
      tap((data) => this.store.setGroupAnalytics(data)),
      finalize(() => this._groupAnalyticsLoading.set(false)),
      map(() => undefined),
    );
  }

  clearGroupAnalytics(): void {
    this.store.clearGroupAnalytics();
  }

  /** Загрузка последних планов развития (GET /api/admin/development-plans/recent), по умолчанию 5. */
  loadRecentDevelopmentPlans(limit = 5): Observable<void> {
    this._recentPlansLoading.set(true);
    return this.api.getRecentDevelopmentPlans(limit).pipe(
      tap((list) => this.store.setRecentDevelopmentPlans(list)),
      finalize(() => this._recentPlansLoading.set(false)),
      map(() => undefined),
    );
  }

  /** Загрузка плана развития по id (GET /api/admin/development-plans/{id}). */
  loadDevelopmentPlanById(id: string): Observable<void> {
    this.store.setSelectedPlanLoading(true);
    return this.api.getDevelopmentPlanById(id).pipe(
      tap((plan) => this.store.setSelectedPlan(plan)),
      finalize(() => this.store.setSelectedPlanLoading(false)),
      map(() => undefined),
    );
  }

  clearSelectedPlan(): void {
    this.store.clearSelectedPlan();
  }

  /** Удаление плана развития (DELETE /api/admin/development-plans/{id}). */
  deleteDevelopmentPlan(id: string): Observable<void> {
    return this.api.deleteDevelopmentPlan(id).pipe(
      tap(() => this.store.removeDevelopmentPlan(id)),
    );
  }

  loadAll(): Observable<void> {
    return forkJoin([this.api.listPlans(), this.api.listTasks()]).pipe(
      tap(([plans, tasks]) => {
        this.store.setPlans(plans);
        this.store.setTasks(tasks);
      }),
      map(() => undefined),
    );
  }

  createPlan(p: Omit<IprPlan, 'id'>): Observable<IprPlan> {
    return this.api.createPlan(p).pipe(tap((item) => this.store.addPlan(item)));
  }
  updatePlan(p: IprPlan): Observable<IprPlan> {
    return this.api.updatePlan(p).pipe(tap((item) => this.store.updatePlan(item)));
  }
  deletePlan(id: string): Observable<void> {
    return this.api.deletePlan(id).pipe(tap(() => this.store.removePlan(id)));
  }

  createTask(t: Omit<IprTask, 'id'>): Observable<IprTask> {
    return this.api.createTask(t).pipe(tap((item) => this.store.addTask(item)));
  }
  updateTask(t: IprTask): Observable<IprTask> {
    return this.api.updateTask(t).pipe(tap((item) => this.store.updateTask(item)));
  }
  deleteTask(id: string): Observable<void> {
    return this.api.deleteTask(id).pipe(tap(() => this.store.removeTask(id)));
  }
}
