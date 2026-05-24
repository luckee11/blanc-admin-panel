import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { LoginCredentials, LoginApiResponse, TokenPair } from '../models/interfaces/auth-user.interface';
import { API_TOKENS_PATH } from '../utils/constants/auth.constants';

type RawTokenResponse = Record<string, unknown>;

/** Нормализует ответ сервера — поддерживает camelCase и snake_case имена полей. */
function normalizeTokenResponse(raw: RawTokenResponse): LoginApiResponse {
  const accessToken =
    (raw['accessToken']   as string | undefined) ??
    (raw['access_token']  as string | undefined) ??
    (raw['token']         as string | undefined) ??
    (raw['jwt']           as string | undefined) ??
    '';

  const refreshToken =
    (raw['refreshToken']  as string | undefined) ??
    (raw['refresh_token'] as string | undefined) ??
    (raw['refreshJwt']    as string | undefined) ??
    '';

  return {
    accessToken,
    refreshToken,
    user: raw['user'] as LoginApiResponse['user'],
  };
}

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);

  /** POST /api/tokens — body: { email, password, skipAD } */
  login(credentials: LoginCredentials): Observable<LoginApiResponse> {
    return this.http.post<RawTokenResponse>(API_TOKENS_PATH, {
      email:    credentials.email,
      password: credentials.password,
      skipAD:   credentials.skipAD ?? false,
    }).pipe(map(normalizeTokenResponse));
  }

  /** POST /api/tokens/refresh — body: { refreshToken } */
  refreshTokens(refreshToken: string): Observable<TokenPair> {
    return this.http.post<RawTokenResponse>(`${API_TOKENS_PATH}/refresh`, { refreshToken })
      .pipe(map((raw) => {
        const normalized = normalizeTokenResponse(raw);
        return {
          accessToken:  normalized.accessToken,
          refreshToken: normalized.refreshToken,
        };
      }));
  }

  logout(): Observable<void> {
    return of(undefined);
  }
}
