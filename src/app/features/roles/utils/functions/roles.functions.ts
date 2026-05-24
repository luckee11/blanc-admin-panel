import { Permission, PermissionGroup } from '../../models/interfaces/permission.interface';
import { Role } from '../../models/interfaces/role.interface';

export function groupPermissions(permissions: Permission[]): PermissionGroup[] {
  const map = new Map<string, Permission[]>();
  for (const p of permissions) {
    if (!map.has(p.group)) map.set(p.group, []);
    map.get(p.group)!.push(p);
  }
  return Array.from(map.entries()).map(([group, items]) => ({ group, items }));
}

export function countGroupSelected(role: Role, items: Permission[]): number {
  return items.filter((p) => role.permissions.includes(p.id)).length;
}

export function toggleRolePermission(role: Role, permId: string, checked: boolean): Role {
  return {
    ...role,
    permissions: checked
      ? [...role.permissions, permId]
      : role.permissions.filter((x) => x !== permId),
  };
}
