export const STATUS_LABELS: Record<string, string> = {
  active: 'Работает',
  leave: 'В отпуске',
  probation: 'Испытательный',
  terminated: 'Уволен',
  draft: 'Черновик',
  in_progress: 'В работе',
  on_review: 'На ревью',
  completed: 'Завершён',
  overdue: 'Просрочен',
  scheduled: 'Запланировано',
  published: 'Опубликовано',
  archived: 'В архиве',
  sent: 'Отправлено',
  failed: 'Ошибка',
};

export const STATUS_BADGE: Record<string, string> = {
  active: 'badge-success',
  leave: 'badge-warning',
  probation: 'badge-info',
  terminated: 'badge-neutral',
  draft: 'badge-neutral',
  in_progress: 'badge-info',
  on_review: 'badge-warning',
  completed: 'badge-success',
  overdue: 'badge-danger',
  scheduled: 'badge-info',
  published: 'badge-success',
  archived: 'badge-neutral',
  sent: 'badge-success',
  failed: 'badge-danger',
};

export const PRIORITY_BADGE: Record<string, string> = {
  high: 'badge-danger',
  medium: 'badge-warning',
  low: 'badge-neutral',
};

export const PRIORITY_LABELS: Record<string, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

export const CATEGORY_LABELS: Record<string, string> = {
  training: 'Обучение',
  project: 'Проект',
  mentorship: 'Менторинг',
  certification: 'Сертификация',
  reading: 'Литература',
};

export function statusBadge(s: string): string { return STATUS_BADGE[s] ?? 'badge-neutral'; }
export function statusLabel(s: string): string { return STATUS_LABELS[s] ?? s; }
