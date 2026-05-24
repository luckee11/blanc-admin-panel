import { StatusPR } from '../../enums/status-pr.enum';

export const STATUS_PR_LABELS: Record<StatusPR, string> = {
  [StatusPR.Draft]: 'Черновик',
  [StatusPR.InProgress]: 'В работе',
  [StatusPR.Completed]: 'Завершён',
  [StatusPR.Archived]: 'В архиве',
};

export type TagSeverity = 'success' | 'warn' | 'info' | 'danger' | 'secondary';

export const STATUS_PR_SEVERITY: Record<StatusPR, TagSeverity> = {
  [StatusPR.Draft]: 'secondary',
  [StatusPR.InProgress]: 'info',
  [StatusPR.Completed]: 'success',
  [StatusPR.Archived]: 'secondary',
};
