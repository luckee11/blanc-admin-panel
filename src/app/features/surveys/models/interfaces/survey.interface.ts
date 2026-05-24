import { SurveyStatus } from '../../enums/survey-status.enum';

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  audience: string;
  questions: number;
  responses: number;
  totalRecipients: number;
  startDate: string;
  endDate: string;
}
