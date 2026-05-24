import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { IprApi } from './ipr.api';
import { IprStore } from './ipr.store';
import { IprPlan } from '../models/interfaces/ipr-plan.interface';
import { IprTask } from '../models/interfaces/ipr-task.interface';

@Injectable({ providedIn: 'root' })
export class IprFacade {
  private api = inject(IprApi);
  private store = inject(IprStore);

  readonly plans = this.store.plans;
  readonly tasks = this.store.tasks;

  constructor() {
    this.loadAll().subscribe();
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
