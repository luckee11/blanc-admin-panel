import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';
import { AuthStore } from '../dataProviders/auth.store';
import { AuthApi } from '../dataProviders/auth.api';
import { API_TOKENS_PATH } from '../utils/constants/auth.constants';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store  = inject(AuthStore);
  const api    = inject(AuthApi);
  const router = inject(Router);

  /* /api/tokens (login + refresh) — не добавляем заголовок */
  const isAuthEndpoint = req.url.includes(API_TOKENS_PATH);

  const token = store.getAccessToken();

  let authReq = req;
  if (!isAuthEndpoint && token) {
    authReq = addBearer(req, token);

    if (isDevMode()) {
      console.debug(
        `[Interceptor] ${req.method} ${req.url} → Authorization: Bearer ${token.slice(0, 30)}…`,
      );
    }
  } else if (!isAuthEndpoint && !token && isDevMode()) {
    console.warn(`[Interceptor] ${req.method} ${req.url} → ⚠️ токен отсутствует`);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isDevMode()) {
        console.warn(`[Interceptor] ${req.method} ${req.url} → ${error.status}`, error.error);
      }

      if (error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      const refreshToken = store.getRefreshToken();

      if (!refreshToken) {
        return logout(store, router, error);
      }

      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((t): t is string => t !== null),
          take(1),
          switchMap((newToken) => next(addBearer(req, newToken))),
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return api.refreshTokens(refreshToken).pipe(
        switchMap((tokens) => {
          store.setTokens(tokens);
          refreshTokenSubject.next(tokens.accessToken);
          if (isDevMode()) {
            console.info('[Interceptor] Token refreshed OK');
          }
          return next(addBearer(req, tokens.accessToken));
        }),
        catchError((refreshError) => {
          if (isDevMode()) {
            console.error('[Interceptor] Refresh failed → logout', refreshError);
          }
          return logout(store, router, refreshError);
        }),
        finalize(() => { isRefreshing = false; }),
      );
    }),
  );
};

function addBearer(req: Parameters<HttpInterceptorFn>[0], token: string) {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function logout(store: AuthStore, router: Router, error: unknown) {
  store.clear();
  router.navigate(['/login']);
  return throwError(() => error);
}
