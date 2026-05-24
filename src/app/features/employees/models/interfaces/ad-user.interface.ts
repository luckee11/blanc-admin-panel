export interface ADUser {
  id: string;
  login: string;
  displayName: string;
  email: string;
  ou: string;
  lastLogin: string;
  enabled: boolean;
  groups: string[];
}
