import { EmploymentStatus } from '../../enums/employment-status.enum';

export type EmployeeFilterState = {
  search: string;
  department: string;
  status: EmploymentStatus | '';
};
