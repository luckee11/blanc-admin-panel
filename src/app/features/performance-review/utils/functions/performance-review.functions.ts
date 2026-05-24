import { StatusPR } from '../../enums/status-pr.enum';
import {
  STATUS_PR_LABELS,
  STATUS_PR_SEVERITY,
  TagSeverity,
} from '../constants/status-pr.constants';

/** Человекочитаемый статус ревью; неизвестные значения возвращаем как есть. */
export function getStatusPRLabel(status: StatusPR | string): string {
  return STATUS_PR_LABELS[status as StatusPR] ?? status ?? '—';
}

/** Цвет тега PrimeNG для статуса ревью. */
export function getStatusPRSeverity(status: StatusPR | string): TagSeverity {
  return STATUS_PR_SEVERITY[status as StatusPR] ?? 'secondary';
}
