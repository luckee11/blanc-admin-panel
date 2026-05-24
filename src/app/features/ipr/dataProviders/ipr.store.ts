import { Injectable, signal } from '@angular/core';
import { IprPlan } from '../models/interfaces/ipr-plan.interface';
import { IprTask } from '../models/interfaces/ipr-task.interface';

@Injectable({ providedIn: 'root' })
export class IprStore {
  private _plans = signal<IprPlan[]>([]);
  readonly plans = this._plans.asReadonly();

  private _tasks = signal<IprTask[]>([]);
  readonly tasks = this._tasks.asReadonly();

  setPlans(items: IprPlan[]) { this._plans.set(items); }
  addPlan(p: IprPlan) { this._plans.update((l) => [p, ...l]); }
  updatePlan(p: IprPlan) { this._plans.update((l) => l.map((x) => x.id === p.id ? p : x)); }
  removePlan(id: string) { this._plans.update((l) => l.filter((x) => x.id !== id)); }

  setTasks(items: IprTask[]) { this._tasks.set(items); }
  addTask(t: IprTask) { this._tasks.update((l) => [t, ...l]); }
  updateTask(t: IprTask) { this._tasks.update((l) => l.map((x) => x.id === t.id ? t : x)); }
  removeTask(id: string) { this._tasks.update((l) => l.filter((x) => x.id !== id)); }
}
