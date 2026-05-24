import { Injectable, inject, isDevMode } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { LoginCredentials } from '../models/interfaces/auth-user.interface';
import { LoginResult } from '../models/types/auth.types';
import { AUTH_ERRORS } from '../utils/constants/auth.constants';
import { buildAuthUserFromToken } from '../utils/functions/auth.functions';
import { AuthApi } from './auth.api';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private api   = inject(AuthApi);
  private store = inject(AuthStore);

  readonly user   = this.store.user;
  readonly tokens = this.store.tokens;

  isAuthenticated(): boolean {
    return this.store.isAuthenticated();
  }

  login(credentials: LoginCredentials): Observable<LoginResult> {
    return this.api.login(credentials).pipe(
      map((response): LoginResult => {
        if (isDevMode()) {
          console.groupCollapsed('[Auth] Login response');
          console.log('accessToken :', response.accessToken  ? `${response.accessToken.slice(0, 40)}…` : '⚠️ MISSING');
          console.log('refreshToken:', response.refreshToken ? `${response.refreshToken.slice(0, 40)}…` : '⚠️ MISSING');
          console.groupEnd();
        }

        if (!response.accessToken) {
          return { ok: false, error: 'Сервер не вернул токен доступа. Проверьте формат ответа API.' };
        }

        const user = buildAuthUserFromToken(
          response.accessToken,
          credentials.email,
          response.user,
        );

        this.store.setSession(
          { accessToken: response.accessToken, refreshToken: response.refreshToken },
          user,
        );

        return { ok: true, user };
      }),
      catchError((err: unknown) => {
        const httpErr = err as { error?: { message?: string }; status?: number };
        const message =
          httpErr?.error?.message ??
          (httpErr?.status === 401 ? AUTH_ERRORS.loginFailed : AUTH_ERRORS.loginFailed);
        return of<LoginResult>({ ok: false, error: message });
      }),
    );
  }

  logout(): Observable<void> {
    return this.api.logout().pipe(
      catchError(() => of(undefined)),
      tap(() => this.store.clear()),
    );
  }
}
