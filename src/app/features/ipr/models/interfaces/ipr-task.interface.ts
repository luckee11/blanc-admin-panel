import { IprStatus } from '../../enums/ipr-status.enum';
import { TaskPriority } from '../../enums/task-priority.enum';
import { TaskCategory } from '../../enums/task-category.enum';
import { DevelopmentPlanItemStatus } from '../../enums/development-plan-item-status.enum';
import { DevelopmentPlanPerson } from './ipr-plan.interface';

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

/** Тело запроса POST /api/admin/development-plans/items/search (SearchDevelopmentPlanItemsDto). */
export interface SearchDevelopmentPlanItemsRequest {
  keyword?: string;
  page?: number;
  pageSize?: number;
  priority?: TaskPriority[];
  status?: DevelopmentPlanItemStatus[];
}

/** Пункт плана развития — элемент ответа поиска задач. */
export interface DevelopmentPlanItemListItem {
  id: string;
  title: string;
  status: DevelopmentPlanItemStatus;
  priority: TaskPriority;
  deadline: string | null;
  expectedResult: string | null;
  actualResult: string | null;
  planId: string;
  year: number;
  employee: DevelopmentPlanPerson | null;
  createdAt: string;
  updatedAt: string;
}

/** Ответ POST /api/admin/development-plans/items/search. */
export interface DevelopmentPlanItemsSearchResponse {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: DevelopmentPlanItemListItem[];
}
