import { AuthRole } from '../../enums/auth-role.enum';

export interface AuthUser {
  email: string;
  name: string;
  role: AuthRole;
  initials: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  skipAD?: boolean;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

/** Поля, которые может вернуть бэкенд вместе с токенами */
export interface LoginApiResponse extends TokenPair {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    displayName?: string;
  };
}
