import { DevelopmentPlanPerson } from './ipr-plan.interface';

/** Счётчики планов развития по статусам (GET /api/admin/development-plans/analytics). */
export interface DevelopmentPlanStatusCounts {
  draft: number;
  agreed: number;
  in_progress: number;
  on_review: number;
  completed: number;
  cancelled: number;
}

/** Аналитика по отдельной группе. */
export interface DevelopmentPlanGroupAnalytics {
  groupId: string;
  groupName: string;
  totalEmployees: number;
  totalPlans: number;
  activePlans: number;
  statusCounts: DevelopmentPlanStatusCounts;
}

/** Ответ GET /api/admin/development-plans/analytics. */
export interface DevelopmentPlansAnalytics {
  totalGroups: number;
  totalEmployees: number;
  totalPlans: number;
  activePlans: number;
  statusCounts: DevelopmentPlanStatusCounts;
  groups: DevelopmentPlanGroupAnalytics[];
}

/** Счётчики пунктов плана по статусам (в аналитике по сотруднику). */
export interface DevelopmentPlanItemStatusCounts {
  backlog: number;
  validatedByManager: number;
  inProgress: number;
  inReview: number;
  acceptedByManager: number;
  willNotBeDone: number;
}

/** Аналитика по сотруднику внутри группы/сквада. */
export interface EmployeePlanAnalytics {
  employee: DevelopmentPlanPerson | null;
  supervisor: DevelopmentPlanPerson | null;
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  years: number[];
  latestPlanStatus: string;
  totalItems: number;
  completedItems: number;
  itemStatusCounts: DevelopmentPlanItemStatusCounts;
}

/** Аналитика по скваду внутри группы. */
export interface SquadAnalytics {
  squadId: string;
  squadName: string;
  totalEmployees: number;
  totalPlans: number;
  activePlans: number;
  statusCounts: DevelopmentPlanStatusCounts;
  employees: EmployeePlanAnalytics[];
}

/** Ответ GET /api/admin/development-plans/analytics/group/{groupId}. */
export interface DevelopmentPlanGroupDetailAnalytics {
  groupId: string;
  groupName: string;
  totalEmployees: number;
  totalPlans: number;
  activePlans: number;
  statusCounts: DevelopmentPlanStatusCounts;
  squads: SquadAnalytics[];
  unassignedEmployees: EmployeePlanAnalytics[];
}
