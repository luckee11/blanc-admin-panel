import { IprStatus } from '../../enums/ipr-status.enum';

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
