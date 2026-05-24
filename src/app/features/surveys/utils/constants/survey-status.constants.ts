import { SurveyStatus } from '../../enums/survey-status.enum';

export const SURVEY_STATUS_LABELS: Record<SurveyStatus, string> = {
  [SurveyStatus.Draft]: 'Черновик',
  [SurveyStatus.Active]: 'Активный',
  [SurveyStatus.Completed]: 'Завершён',
  [SurveyStatus.Archived]: 'В архиве',
};

export const SURVEY_STATUS_BADGE: Record<SurveyStatus, string> = {
  [SurveyStatus.Draft]: 'badge-neutral',
  [SurveyStatus.Active]: 'badge-success',
  [SurveyStatus.Completed]: 'badge-info',
  [SurveyStatus.Archived]: 'badge-neutral',
};
