import { Injectable, computed, signal } from '@angular/core';
import { Permission } from '../models/interfaces/permission.interface';
import { Role } from '../models/interfaces/role.interface';
import { groupPermissions } from '../utils/functions/roles.functions';

@Injectable({ providedIn: 'root' })
export class RolesStore {
  private _roles = signal<Role[]>([]);
  readonly roles = this._roles.asReadonly();

  private _permissions = signal<Permission[]>([]);
  readonly permissions = this._permissions.asReadonly();

  readonly permissionGroups = computed(() => groupPermissions(this._permissions()));

  setRoles(items: Role[]) { this._roles.set(items); }
  setPermissions(items: Permission[]) { this._permissions.set(items); }

  addRole(r: Role) { this._roles.update((l) => [r, ...l]); }
  updateRole(r: Role) { this._roles.update((l) => l.map((x) => x.id === r.id ? r : x)); }
  removeRole(id: string) { this._roles.update((l) => l.filter((x) => x.id !== id)); }
}
