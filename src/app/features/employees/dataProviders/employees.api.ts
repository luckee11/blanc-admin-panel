import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { makeId } from '../../../shared/utils/text';
import {
  HumanDetail,
  HumansSearchRequest,
  HumansSearchResponse,
  RecentHuman,
  UpdateHumanRequest,
} from '../models/interfaces/human.interface';
import { EmploymentStatus } from '../enums/employment-status.enum';
import { ContactType } from '../enums/contact-type.enum';
import { Employee } from '../models/interfaces/employee.interface';
import { Department } from '../models/interfaces/department.interface';
import { Squad } from '../models/interfaces/squad.interface';
import { Contact } from '../models/interfaces/contact.interface';

const SEED_EMPLOYEES: Employee[] = [
  { id: makeId(), fullName: 'Анна Соколова', position: 'HR Business Partner', department: 'HR', email: 'a.sokolova@blanc.bank', phone: '+7 (495) 110-22-01', hireDate: '2022-03-14', status: EmploymentStatus.Active, manager: 'Илья Громов', city: 'Москва' },
  { id: makeId(), fullName: 'Дмитрий Орлов', position: 'Старший разработчик', department: 'IT', email: 'd.orlov@blanc.bank', phone: '+7 (495) 110-22-02', hireDate: '2020-09-01', status: EmploymentStatus.Active, manager: 'Сергей Беляев', city: 'Москва' },
  { id: makeId(), fullName: 'Мария Лебедева', position: 'Дизайнер', department: 'Маркетинг', email: 'm.lebedeva@blanc.bank', phone: '+7 (495) 110-22-03', hireDate: '2023-06-20', status: EmploymentStatus.Probation, manager: 'Ольга Сергеева', city: 'Санкт-Петербург' },
  { id: makeId(), fullName: 'Игорь Захаров', position: 'Финансовый аналитик', department: 'Финансы', email: 'i.zakharov@blanc.bank', phone: '+7 (495) 110-22-04', hireDate: '2019-02-11', status: EmploymentStatus.Active, manager: 'Елена Кузьмина', city: 'Москва' },
  { id: makeId(), fullName: 'Татьяна Воронова', position: 'Менеджер по продукту', department: 'Продукт', email: 't.voronova@blanc.bank', phone: '+7 (495) 110-22-05', hireDate: '2021-11-08', status: EmploymentStatus.Leave, manager: 'Артём Никитин', city: 'Москва' },
  { id: makeId(), fullName: 'Павел Морозов', position: 'Бухгалтер', department: 'Финансы', email: 'p.morozov@blanc.bank', phone: '+7 (495) 110-22-06', hireDate: '2018-04-22', status: EmploymentStatus.Active, manager: 'Елена Кузьмина', city: 'Казань' },
  { id: makeId(), fullName: 'Светлана Зайцева', position: 'Рекрутер', department: 'HR', email: 's.zaytseva@blanc.bank', phone: '+7 (495) 110-22-07', hireDate: '2024-01-15', status: EmploymentStatus.Probation, manager: 'Илья Громов', city: 'Москва' },
  { id: makeId(), fullName: 'Никита Семенов', position: 'DevOps инженер', department: 'IT', email: 'n.semenov@blanc.bank', phone: '+7 (495) 110-22-08', hireDate: '2022-07-12', status: EmploymentStatus.Active, manager: 'Сергей Беляев', city: 'Москва' },
];

const SEED_DEPARTMENTS: Department[] = [
  { id: makeId(), name: 'HR', code: 'HR', head: 'Илья Громов', headcount: 18, description: 'Управление персоналом и развитие сотрудников' },
  { id: makeId(), name: 'IT', code: 'IT', head: 'Сергей Беляев', headcount: 64, description: 'Разработка, инфраструктура, поддержка' },
  { id: makeId(), name: 'Финансы', code: 'FIN', head: 'Елена Кузьмина', headcount: 32, description: 'Бухгалтерия, казначейство, аналитика' },
  { id: makeId(), name: 'Маркетинг', code: 'MKT', head: 'Ольга Сергеева', headcount: 21, description: 'Бренд, коммуникации, performance' },
  { id: makeId(), name: 'Продукт', code: 'PROD', head: 'Артём Никитин', headcount: 27, description: 'Продуктовые команды self-портала' },
  { id: makeId(), name: 'Юридический', code: 'LEG', head: 'Виктор Малышев', headcount: 11, description: 'Правовое сопровождение' },
];

const SEED_CONTACTS: Contact[] = [
  { id: makeId(), name: 'Анна Соколова', position: 'HRBP', email: 'a.sokolova@blanc.bank', phone: '+7 (495) 110-22-01', department: 'HR', type: ContactType.Internal },
  { id: makeId(), name: 'Илья Громов', position: 'Директор по персоналу', email: 'i.gromov@blanc.bank', phone: '+7 (495) 110-22-00', department: 'HR', type: ContactType.Internal },
  { id: makeId(), name: 'Алексей Сидоров', position: 'Юрист', email: 'a.sidorov@partner.ru', phone: '+7 (812) 555-12-34', department: 'Юридический', type: ContactType.Partner },
  { id: makeId(), name: 'Поддержка HRM', position: 'Сервис', email: 'support@hrm-system.ru', phone: '+7 (800) 100-20-30', department: 'Внешние сервисы', type: ContactType.External },
  { id: makeId(), name: 'Сергей Беляев', position: 'CTO', email: 's.belyaev@blanc.bank', phone: '+7 (495) 110-22-50', department: 'IT', type: ContactType.Internal },
];

@Injectable({ providedIn: 'root' })
export class EmployeesApi {
  private http = inject(HttpClient);

  /* ===== Real API: humans (employed) ===== */
  searchHumans(req: HumansSearchRequest): Observable<HumansSearchResponse> {
    return this.http.post<HumansSearchResponse>('/api/admin/humans/search', req);
  }

  getHumanById(id: string): Observable<HumanDetail> {
    return this.http.get<HumanDetail>(`/api/admin/humans/${id}`);
  }

  deleteHuman(id: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/humans/${id}`);
  }

  updateHuman(id: string, body: UpdateHumanRequest): Observable<void> {
    return this.http.patch<void>(`/api/admin/humans/${id}`, body);
  }

  getRecentHumans(): Observable<RecentHuman[]> {
    return this.http.get<RecentHuman[]>('/api/admin/humans/recent');
  }

  /**
   * GET /api/admin/squads — отделы/группы.
   * search — поиск по руководителю, куратору, названию отдела или сотруднику.
   */
  getSquads(search?: string): Observable<Squad[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<Squad[]>('/api/admin/squads', { params });
  }

  /* ===== Mock: employees CRUD ===== */
  listEmployees(): Observable<Employee[]> { return of(SEED_EMPLOYEES); }
  createEmployee(e: Omit<Employee, 'id'>): Observable<Employee> { return of({ ...e, id: makeId() }); }
  updateEmployee(e: Employee): Observable<Employee> { return of(e); }
  deleteEmployee(_id: string): Observable<void> { return of(undefined); }

  listDepartments(): Observable<Department[]> { return of(SEED_DEPARTMENTS); }
  createDepartment(d: Omit<Department, 'id'>): Observable<Department> { return of({ ...d, id: makeId() }); }
  updateDepartment(d: Department): Observable<Department> { return of(d); }
  deleteDepartment(_id: string): Observable<void> { return of(undefined); }

  listContacts(): Observable<Contact[]> { return of(SEED_CONTACTS); }
  createContact(c: Omit<Contact, 'id'>): Observable<Contact> { return of({ ...c, id: makeId() }); }
  updateContact(c: Contact): Observable<Contact> { return of(c); }
  deleteContact(_id: string): Observable<void> { return of(undefined); }
}
