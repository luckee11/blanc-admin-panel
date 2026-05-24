import { Injectable, signal } from '@angular/core';
import { AuthUser, TokenPair } from '../models/interfaces/auth-user.interface';
import { ACCESS_TOKEN_KEY, AUTH_USER_KEY, REFRESH_TOKEN_KEY } from '../utils/constants/auth.constants';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _user   = signal<AuthUser | null>(this.loadUser());
  private _tokens = signal<TokenPair | null>(this.loadTokens());

  readonly user   = this._user.asReadonly();
  readonly tokens = this._tokens.asReadonly();

  /* ===== Сессия ===== */

  setSession(tokens: TokenPair, user: AuthUser): void {
    this._tokens.set(tokens);
    this._user.set(user);
    this.persistTokens(tokens);
    this.persistUser(user);
  }

  /** Обновляем только токены (после refresh). */
  setTokens(tokens: TokenPair): void {
    this._tokens.set(tokens);
    this.persistTokens(tokens);
  }

  clear(): void {
    this._tokens.set(null);
    this._user.set(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  /* ===== Selectors ===== */

  isAuthenticated(): boolean {
    return this._tokens() !== null;
  }

  getAccessToken(): string | null {
    return this._tokens()?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this._tokens()?.refreshToken ?? null;
  }

  /* ===== Persistence ===== */

  private persistTokens(tokens: TokenPair): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY,  tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } catch { /* noop */ }
  }

  private persistUser(user: AuthUser): void {
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch { /* noop */ }
  }

  private loadTokens(): TokenPair | null {
    try {
      const access  = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!access || !refresh) return null;
      return { accessToken: access, refreshToken: refresh };
    } catch {
      return null;
    }
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
