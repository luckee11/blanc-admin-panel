import { EmailStatus } from '../../enums/email-status.enum';
import { AudienceOption } from '../../models/interfaces/email-message.interface';

export const EMAIL_STATUS_LABELS: Record<EmailStatus, string> = {
  [EmailStatus.Draft]: 'Черновик',
  [EmailStatus.Scheduled]: 'Запланировано',
  [EmailStatus.Sent]: 'Отправлено',
  [EmailStatus.Failed]: 'Ошибка',
};

export const EMAIL_STATUS_BADGE: Record<EmailStatus, string> = {
  [EmailStatus.Draft]: 'badge-neutral',
  [EmailStatus.Scheduled]: 'badge-info',
  [EmailStatus.Sent]: 'badge-success',
  [EmailStatus.Failed]: 'badge-danger',
};

export const AUDIENCES: AudienceOption[] = [
  { value: 'all', label: 'Все сотрудники', count: 218 },
  { value: 'hr', label: 'Отдел HR', count: 18 },
  { value: 'it', label: 'Отдел IT', count: 64 },
  { value: 'finance', label: 'Финансы', count: 32 },
  { value: 'marketing', label: 'Маркетинг', count: 21 },
  { value: 'managers', label: 'Руководители', count: 45 },
  { value: 'probation', label: 'На испытательном сроке', count: 9 },
];
