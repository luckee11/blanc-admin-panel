import { AuthUser } from '../interfaces/auth-user.interface';

export type LoginResult =
  | { ok: true;  user: AuthUser }
  | { ok: false; error: string };

export type AuthState = 'idle' | 'loading' | 'authenticated' | 'error';
