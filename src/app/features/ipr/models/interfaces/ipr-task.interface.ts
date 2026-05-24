import { IprStatus } from '../../enums/ipr-status.enum';
import { TaskPriority } from '../../enums/task-priority.enum';
import { TaskCategory } from '../../enums/task-category.enum';

export interface IprTask {
  id: string;
  planId: string;
  employeeName: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: IprStatus;
  dueDate: string;
}
