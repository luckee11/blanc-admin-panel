import { AuthRole } from '../../enums/auth-role.enum';
import { AuthUser } from '../../models/interfaces/auth-user.interface';

/** Декодируем JWT payload без верификации подписи (только для отображения). */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Строим AuthUser из данных токена или из email. */
export function buildAuthUserFromToken(
  accessToken: string,
  emailFallback: string,
  serverUser?: { name?: string; email?: string; displayName?: string; role?: string },
): AuthUser {
  const payload = decodeJwtPayload(accessToken);

  const email =
    (serverUser?.email as string) ||
    (payload?.['email'] as string) ||
    (payload?.['sub'] as string) ||
    emailFallback;

  const rawName =
    (serverUser?.displayName as string) ||
    (serverUser?.name as string) ||
    (payload?.['name'] as string) ||
    (payload?.['displayName'] as string) ||
    buildNameFromEmail(email);

  const role = resolveRole(
    (serverUser?.role as string) || (payload?.['role'] as string),
  );

  const initials = rawName
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return { email, name: rawName, role, initials };
}

function buildNameFromEmail(email: string): string {
  const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
  return namePart.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Администратор';
}

function resolveRole(raw?: string): AuthRole {
  if (!raw) return AuthRole.SuperAdmin;
  const map: Record<string, AuthRole> = {
    'super admin': AuthRole.SuperAdmin,
    'hr admin':    AuthRole.HRAdmin,
    'hr specialist': AuthRole.HRSpecialist,
    'content editor': AuthRole.ContentEditor,
    viewer: AuthRole.Viewer,
  };
  return map[raw.toLowerCase()] ?? AuthRole.Viewer;
}
