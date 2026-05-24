import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, forkJoin, map, tap } from 'rxjs';
import { EmployeesApi } from './employees.api';
import { EmployeesStore } from './employees.store';
import { Employee } from '../models/interfaces/employee.interface';
import { ADUser } from '../models/interfaces/ad-user.interface';
import { Department } from '../models/interfaces/department.interface';
import { Contact } from '../models/interfaces/contact.interface';
import { Human, HumansSearchRequest, UpdateHumanRequest } from '../models/interfaces/human.interface';

@Injectable({ providedIn: 'root' })
export class EmployeesFacade {
  private api   = inject(EmployeesApi);
  private store = inject(EmployeesStore);

  /* ===== Humans (employed — real API) ===== */
  readonly humans           = this.store.humans;
  readonly humansPagination = this.store.humansPagination;

  private _humansLoading = signal(false);
  readonly humansLoading = this._humansLoading.asReadonly();

  searchHumans(req: HumansSearchRequest = {}): Observable<void> {
    this._humansLoading.set(true);
    return this.api.searchHumans(req).pipe(
      tap((res) => this.store.setHumans(res)),
      finalize(() => this._humansLoading.set(false)),
      map(() => undefined),
    );
  }

  /* ===== Human Detail ===== */
  readonly selectedHuman        = this.store.selectedHuman;
  readonly selectedHumanLoading = this.store.selectedHumanLoading;

  loadHumanById(id: string): Observable<void> {
    this.store.setSelectedHumanLoading(true);
    return this.api.getHumanById(id).pipe(
      tap((detail) => this.store.setSelectedHuman(detail)),
      finalize(() => this.store.setSelectedHumanLoading(false)),
      map(() => undefined),
    );
  }

  clearSelectedHuman(): void {
    this.store.clearSelectedHuman();
  }

  deleteHuman(id: string): Observable<void> {
    return this.api.deleteHuman(id).pipe(
      tap(() => {
        this.store.removeHuman(id);
        this.store.clearSelectedHuman();
      }),
    );
  }

  /** Частичное обновление сотрудника через PATCH /api/admin/humans/{id} с последующей перезагрузкой detail. */
  updateHuman(id: string, body: UpdateHumanRequest): Observable<void> {
    return this.api.updateHuman(id, body).pipe(
      tap(() => {
        // После сохранения подтягиваем актуальный detail (без ожидания через chain).
        this.loadHumanById(id).subscribe();
      }),
    );
  }

  /** Лёгкий поиск сотрудников для автокомплита (с возможностью исключить заданный id). */
  searchHumansLite(keyword: string, excludeId?: string, pageSize = 10): Observable<Human[]> {
    return this.api.searchHumans({ keyword: keyword?.trim() || undefined, page: 0, pageSize }).pipe(
      map((res) => (excludeId ? res.data.filter((h) => h.id !== excludeId) : res.data)),
    );
  }

  /* ===== Recent humans (GET /api/admin/humans/recent) ===== */
  readonly recentHumans = this.store.recentHumans;

  private _recentHumansLoading = signal(false);
  readonly recentHumansLoading = this._recentHumansLoading.asReadonly();

  loadRecentHumans(): Observable<void> {
    this._recentHumansLoading.set(true);
    return this.api.getRecentHumans().pipe(
      tap((list) => this.store.setRecentHumans(list)),
      finalize(() => this._recentHumansLoading.set(false)),
      map(() => undefined),
    );
  }

  /* ===== Employees (mock CRUD) ===== */
  readonly employees   = this.store.employees;
  readonly adUsers     = this.store.adUsers;
  readonly departments = this.store.departments;
  readonly contacts    = this.store.contacts;

  constructor() {
    this.loadSupportData().subscribe();
  }

  loadSupportData(): Observable<void> {
    return forkJoin([
      this.api.listEmployees(),
      this.api.listADUsers(),
      this.api.listDepartments(),
      this.api.listContacts(),
    ]).pipe(
      tap(([emps, ad, depts, contacts]) => {
        this.store.setEmployees(emps);
        this.store.setADUsers(ad);
        this.store.setDepartments(depts);
        this.store.setContacts(contacts);
      }),
      map(() => undefined),
    );
  }

  createEmployee(e: Omit<Employee, 'id'>): Observable<Employee> {
    return this.api.createEmployee(e).pipe(tap((item) => this.store.addEmployee(item)));
  }
  updateEmployee(e: Employee): Observable<Employee> {
    return this.api.updateEmployee(e).pipe(tap((item) => this.store.updateEmployee(item)));
  }
  deleteEmployee(id: string): Observable<void> {
    return this.api.deleteEmployee(id).pipe(tap(() => this.store.removeEmployee(id)));
  }

  createADUser(u: Omit<ADUser, 'id'>): Observable<ADUser> {
    return this.api.createADUser(u).pipe(tap((item) => this.store.addADUser(item)));
  }
  updateADUser(u: ADUser): Observable<ADUser> {
    return this.api.updateADUser(u).pipe(tap((item) => this.store.updateADUser(item)));
  }
  deleteADUser(id: string): Observable<void> {
    return this.api.deleteADUser(id).pipe(tap(() => this.store.removeADUser(id)));
  }

  createDepartment(d: Omit<Department, 'id'>): Observable<Department> {
    return this.api.createDepartment(d).pipe(tap((item) => this.store.addDepartment(item)));
  }
  updateDepartment(d: Department): Observable<Department> {
    return this.api.updateDepartment(d).pipe(tap((item) => this.store.updateDepartment(item)));
  }
  deleteDepartment(id: string): Observable<void> {
    return this.api.deleteDepartment(id).pipe(tap(() => this.store.removeDepartment(id)));
  }

  createContact(c: Omit<Contact, 'id'>): Observable<Contact> {
    return this.api.createContact(c).pipe(tap((item) => this.store.addContact(item)));
  }
  updateContact(c: Contact): Observable<Contact> {
    return this.api.updateContact(c).pipe(tap((item) => this.store.updateContact(item)));
  }
  deleteContact(id: string): Observable<void> {
    return this.api.deleteContact(id).pipe(tap(() => this.store.removeContact(id)));
  }
}
