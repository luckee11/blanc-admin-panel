import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { RolesApi } from './roles.api';
import { RolesStore } from './roles.store';
import { Role } from '../models/interfaces/role.interface';
import { toggleRolePermission } from '../utils/functions/roles.functions';

@Injectable({ providedIn: 'root' })
export class RolesFacade {
  private api = inject(RolesApi);
  private store = inject(RolesStore);

  readonly roles = this.store.roles;
  readonly permissions = this.store.permissions;
  readonly permissionGroups = this.store.permissionGroups;

  constructor() {
    this.loadAll().subscribe();
  }

  loadAll(): Observable<void> {
    return forkJoin([this.api.listRoles(), this.api.listPermissions()]).pipe(
      tap(([roles, perms]) => {
        this.store.setRoles(roles);
        this.store.setPermissions(perms);
      }),
      map(() => undefined),
    );
  }

  createRole(r: Omit<Role, 'id'>): Observable<Role> {
    return this.api.createRole(r).pipe(tap((item) => this.store.addRole(item)));
  }

  updateRole(r: Role): Observable<Role> {
    return this.api.updateRole(r).pipe(tap((item) => this.store.updateRole(item)));
  }

  deleteRole(id: string): Observable<void> {
    return this.api.deleteRole(id).pipe(tap(() => this.store.removeRole(id)));
  }

  togglePermission(role: Role, permId: string, checked: boolean): Observable<Role> {
    const next = toggleRolePermission(role, permId, checked);
    return this.updateRole(next);
  }
}
