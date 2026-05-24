import { IprStatus } from '../../enums/ipr-status.enum';
import { TaskPriority } from '../../enums/task-priority.enum';
import { TaskCategory } from '../../enums/task-category.enum';

export const IPR_STATUS_LABELS: Record<IprStatus, string> = {
  [IprStatus.Draft]: 'Черновик',
  [IprStatus.InProgress]: 'В работе',
  [IprStatus.OnReview]: 'На ревью',
  [IprStatus.Completed]: 'Завершён',
  [IprStatus.Overdue]: 'Просрочен',
};

export const IPR_STATUS_BADGE: Record<IprStatus, string> = {
  [IprStatus.Draft]: 'badge-neutral',
  [IprStatus.InProgress]: 'badge-info',
  [IprStatus.OnReview]: 'badge-warning',
  [IprStatus.Completed]: 'badge-success',
  [IprStatus.Overdue]: 'badge-danger',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.High]: 'Высокий',
  [TaskPriority.Medium]: 'Средний',
  [TaskPriority.Low]: 'Низкий',
};

export const TASK_PRIORITY_BADGE: Record<TaskPriority, string> = {
  [TaskPriority.High]: 'badge-danger',
  [TaskPriority.Medium]: 'badge-warning',
  [TaskPriority.Low]: 'badge-neutral',
};

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  [TaskCategory.Training]: 'Обучение',
  [TaskCategory.Project]: 'Проект',
  [TaskCategory.Mentorship]: 'Менторинг',
  [TaskCategory.Certification]: 'Сертификация',
  [TaskCategory.Reading]: 'Литература',
};
