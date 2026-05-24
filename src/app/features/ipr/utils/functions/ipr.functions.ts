import { IprStatus } from '../../enums/ipr-status.enum';
import { TaskPriority } from '../../enums/task-priority.enum';
import { TaskCategory } from '../../enums/task-category.enum';
import {
  IPR_STATUS_LABELS, IPR_STATUS_BADGE,
  TASK_PRIORITY_LABELS, TASK_PRIORITY_BADGE,
  TASK_CATEGORY_LABELS,
} from '../constants/ipr-status.constants';

export function getIprStatusLabel(s: IprStatus): string { return IPR_STATUS_LABELS[s] ?? s; }
export function getIprStatusBadge(s: IprStatus): string { return IPR_STATUS_BADGE[s] ?? 'badge-neutral'; }
export function getPriorityLabel(p: TaskPriority): string { return TASK_PRIORITY_LABELS[p] ?? p; }
export function getPriorityBadge(p: TaskPriority): string { return TASK_PRIORITY_BADGE[p] ?? 'badge-neutral'; }
export function getCategoryLabel(c: TaskCategory): string { return TASK_CATEGORY_LABELS[c] ?? c; }

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

export function calcProgress(tasksDone: number, tasksTotal: number): number {
  return tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;
}
