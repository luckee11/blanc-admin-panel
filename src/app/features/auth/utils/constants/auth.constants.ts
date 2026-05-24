export const ACCESS_TOKEN_KEY  = 'blanc-access-token';
export const REFRESH_TOKEN_KEY = 'blanc-refresh-token';
export const AUTH_USER_KEY     = 'blanc-auth-user';

export const AUTH_ERRORS = {
  invalidEmail:    'Введите корректный email',
  passwordTooShort: 'Пароль должен быть не короче 4 символов',
  loginFailed:     'Не удалось войти. Проверьте email и пароль.',
  sessionExpired:  'Сессия истекла. Войдите снова.',
} as const;

export const API_TOKENS_PATH = '/api/tokens';
