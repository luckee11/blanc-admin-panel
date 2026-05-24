export interface Permission {
  id: string;
  code: string;
  name: string;
  group: string;
}

export interface PermissionGroup {
  group: string;
  items: Permission[];
}
