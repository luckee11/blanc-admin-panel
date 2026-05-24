import { IprStatus } from '../../enums/ipr-status.enum';
import { TaskPriority } from '../../enums/task-priority.enum';

export interface IprPlan {
  id: string;
  employeeName: string;
  position: string;
  period: string;
  goal: string;
  status: IprStatus;
  progress: number;
  tasksTotal: number;
  tasksDone: number;
  mentor?: string;
  startDate: string;
  endDate: string;
}

/** Тело запроса POST /api/admin/development-plans/search (SearchDevelopmentPlansDto). */
export interface SearchDevelopmentPlansRequest {
  keyword?: string;
  page?: number;
  pageSize?: number;
  status?: IprStatus[];
}

/** Сотрудник внутри плана развития (вложенный объект ответа). */
export interface DevelopmentPlanEmployee {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string | null;
  image: string | null;
  position: string | null;
  squadName: string | null;
  email: string | null;
  phone: string | null;
  telegramId: string | null;
  status: string | null;
}

/** Руководитель внутри плана развития (вложенный объект ответа). */
export interface DevelopmentPlanSupervisor {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string | null;
  image: string | null;
}

/** Элемент списка планов развития (DevelopmentPlanListResponseDto). */
export interface DevelopmentPlanListItem {
  id: string;
  year: number;
  status: IprStatus;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  employee: DevelopmentPlanEmployee | null;
  supervisor: DevelopmentPlanSupervisor | null;
  itemsCount: number;
  completedItemsCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Лёгкий объект человека в детальном ответе плана (employee/supervisor/createdBy/assignee). */
export interface DevelopmentPlanPerson {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string | null;
  image: string | null;
}

/** Пункт плана развития (items[] в детальном ответе). */
export interface DevelopmentPlanItem {
  id: string;
  title: string;
  /** Статус пункта (backlog, in_progress, review, done, ...). */
  status: string;
  priority: TaskPriority;
  deadline: string | null;
  expectedResult: string | null;
  actualResult: string | null;
  assignee: DevelopmentPlanPerson | null;
  participantDepartments: string | null;
  /** План по месяцам — 12 булевых флагов (янв…дек). */
  monthlyPlan: boolean[];
  createdBy: DevelopmentPlanPerson | null;
  commentCount: number;
  comments: unknown[];
  createdAt: string;
  updatedAt: string;
}

/** Детальный план развития (GET /api/admin/development-plans/{id}). */
export interface DevelopmentPlanDetail {
  id: string;
  year: number;
  status: IprStatus;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  employee: DevelopmentPlanPerson | null;
  supervisor: DevelopmentPlanPerson | null;
  createdBy: DevelopmentPlanPerson | null;
  items: DevelopmentPlanItem[];
  files: unknown[];
  createdAt: string;
  updatedAt: string;
}

/** Ответ POST /api/admin/development-plans/search (DevelopmentPlanSearchResponseDto). */
export interface DevelopmentPlansSearchResponse {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: DevelopmentPlanListItem[];
}
