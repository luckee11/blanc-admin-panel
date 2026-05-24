import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/interfaces/employee.interface';
import { Department } from '../models/interfaces/department.interface';
import { Squad } from '../models/interfaces/squad.interface';
import { Human, HumanDetail, HumansSearchResponse, RecentHuman } from '../models/interfaces/human.interface';

export interface HumansPagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({ providedIn: 'root' })
export class EmployeesStore {
  /* ===== Humans (employed — real API) ===== */
  private _humans = signal<Human[]>([]);
  readonly humans = this._humans.asReadonly();

  private _humansPagination = signal<HumansPagination | null>(null);
  readonly humansPagination = this._humansPagination.asReadonly();

  setHumans(res: HumansSearchResponse): void {
    this._humans.set(res.data);
    this._humansPagination.set({
      currentPage:     res.currentPage,
      pageSize:        res.pageSize,
      totalCount:      res.totalCount,
      totalPages:      res.totalPages,
      hasNextPage:     res.hasNextPage,
      hasPreviousPage: res.hasPreviousPage,
    });
  }

  /* ===== Human Detail ===== */
  private _selectedHuman = signal<HumanDetail | null>(null);
  readonly selectedHuman = this._selectedHuman.asReadonly();

  private _selectedHumanLoading = signal(false);
  readonly selectedHumanLoading = this._selectedHumanLoading.asReadonly();

  setSelectedHuman(h: HumanDetail): void { this._selectedHuman.set(h); }
  setSelectedHumanLoading(v: boolean): void { this._selectedHumanLoading.set(v); }
  clearSelectedHuman(): void { this._selectedHuman.set(null); }
  removeHuman(id: string): void { this._humans.update((l) => l.filter((h) => h.id !== id)); }

  /* ===== Recent humans ===== */
  private _recentHumans = signal<RecentHuman[]>([]);
  readonly recentHumans = this._recentHumans.asReadonly();
  setRecentHumans(items: RecentHuman[]): void { this._recentHumans.set(items); }

  /* ===== Employees (mock CRUD) ===== */
  private _employees = signal<Employee[]>([]);
  readonly employees = this._employees.asReadonly();

  setEmployees(items: Employee[]) { this._employees.set(items); }
  addEmployee(e: Employee) { this._employees.update((l) => [e, ...l]); }
  updateEmployee(e: Employee) { this._employees.update((l) => l.map((x) => x.id === e.id ? e : x)); }
  removeEmployee(id: string) { this._employees.update((l) => l.filter((x) => x.id !== id)); }

  /* ===== Departments ===== */
  private _departments = signal<Department[]>([]);
  readonly departments = this._departments.asReadonly();

  setDepartments(items: Department[]) { this._departments.set(items); }
  addDepartment(d: Department) { this._departments.update((l) => [d, ...l]); }
  updateDepartment(d: Department) { this._departments.update((l) => l.map((x) => x.id === d.id ? d : x)); }
  removeDepartment(id: string) { this._departments.update((l) => l.filter((x) => x.id !== id)); }

  /* ===== Squads (отделы — реальный API /api/admin/squads) ===== */
  private _squads = signal<Squad[]>([]);
  readonly squads = this._squads.asReadonly();

  setSquads(items: Squad[]) { this._squads.set(items); }
}
