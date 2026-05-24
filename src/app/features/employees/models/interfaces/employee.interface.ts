import { EmploymentStatus } from '../../enums/employment-status.enum';

export interface Employee {
  id: string;
  fullName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: EmploymentStatus;
  manager?: string;
  city?: string;
}
