import { Employee } from '../../models/interfaces/employee.interface';
import { EmploymentStatus } from '../../enums/employment-status.enum';
import {
  EMPLOYMENT_STATUS_BADGE,
  EMPLOYMENT_STATUS_LABELS,
} from '../constants/employment-status.constants';

export function getEmploymentStatusLabel(status: EmploymentStatus): string {
  return EMPLOYMENT_STATUS_LABELS[status] ?? status;
}

export function getEmploymentStatusBadge(status: EmploymentStatus): string {
  return EMPLOYMENT_STATUS_BADGE[status] ?? 'badge-neutral';
}

export function filterEmployees(
  employees: Employee[],
  search: string,
  department: string,
  status: string,
): Employee[] {
  const q = search.toLowerCase().trim();
  return employees.filter((e) => {
    if (department && e.department !== department) return false;
    if (status && e.status !== status) return false;
    if (!q) return true;
    return (
      e.fullName.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q)
    );
  });
}

/**
 * Маппинг статусов сотрудников (из api/humans/search) на цвет тега.
 * Статусы приходят в виде свободного текста на русском.
 */
export function getHumanStatusSeverity(
  status: string,
): 'success' | 'warn' | 'info' | 'danger' | 'secondary' {
  const s = status.toLowerCase();
  if (s === 'работа')                         return 'success';
  if (s.includes('отпуск') || s === 'отпуск') return 'warn';
  if (s.includes('больн'))                    return 'info';
  if (s.includes('уволен') || s.includes('увол')) return 'danger';
  return 'secondary';
}
