import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { makeId } from '../../../shared/utils/text';
import { Permission } from '../models/interfaces/permission.interface';
import { Role } from '../models/interfaces/role.interface';
import { ALL_PERMISSIONS } from '../utils/constants/permissions.constants';

const SEED_ROLES: Role[] = [
  { id: makeId(), name: 'Super Admin', description: 'Полный доступ к системе', permissions: ALL_PERMISSIONS.map((p) => p.id), users: 3, system: true },
  { id: makeId(), name: 'HR Admin', description: 'Управление персоналом, ИПР, опросами', permissions: ['p1', 'p2', 'p3', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12'], users: 8, system: false },
  { id: makeId(), name: 'HR Specialist', description: 'Просмотр и редактирование сотрудников', permissions: ['p1', 'p2', 'p6', 'p7', 'p9'], users: 14, system: false },
  { id: makeId(), name: 'Content Editor', description: 'Новости и рассылки', permissions: ['p1', 'p11', 'p12'], users: 5, system: false },
  { id: makeId(), name: 'Viewer', description: 'Только просмотр', permissions: ['p1', 'p4', 'p6', 'p9'], users: 22, system: true },
];

@Injectable({ providedIn: 'root' })
export class RolesApi {
  listPermissions(): Observable<Permission[]> { return of(ALL_PERMISSIONS); }
  listRoles(): Observable<Role[]> { return of(SEED_ROLES); }
  createRole(r: Omit<Role, 'id'>): Observable<Role> { return of({ ...r, id: makeId() }); }
  updateRole(r: Role): Observable<Role> { return of(r); }
  deleteRole(_id: string): Observable<void> { return of(undefined); }
}
