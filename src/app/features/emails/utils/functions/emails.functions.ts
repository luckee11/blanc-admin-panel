import { EmailStatus } from '../../enums/email-status.enum';
import { EMAIL_STATUS_BADGE, EMAIL_STATUS_LABELS } from '../constants/email-status.constants';

export function getEmailStatusLabel(s: EmailStatus): string { return EMAIL_STATUS_LABELS[s] ?? s; }
export function getEmailStatusBadge(s: EmailStatus): string { return EMAIL_STATUS_BADGE[s] ?? 'badge-neutral'; }
