import { EmploymentStatus } from '../../enums/employment-status.enum';

export const EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatus, string> = {
  [EmploymentStatus.Active]: 'Работает',
  [EmploymentStatus.Leave]: 'В отпуске',
  [EmploymentStatus.Probation]: 'Испытательный',
  [EmploymentStatus.Terminated]: 'Уволен',
};

export const EMPLOYMENT_STATUS_BADGE: Record<EmploymentStatus, string> = {
  [EmploymentStatus.Active]: 'badge-success',
  [EmploymentStatus.Leave]: 'badge-warning',
  [EmploymentStatus.Probation]: 'badge-info',
  [EmploymentStatus.Terminated]: 'badge-neutral',
};
