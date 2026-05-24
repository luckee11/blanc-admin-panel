import { Survey } from '../../models/interfaces/survey.interface';
import { SurveyStatus } from '../../enums/survey-status.enum';
import { SURVEY_STATUS_BADGE, SURVEY_STATUS_LABELS } from '../constants/survey-status.constants';

export function getSurveyStatusLabel(s: SurveyStatus): string { return SURVEY_STATUS_LABELS[s] ?? s; }
export function getSurveyStatusBadge(s: SurveyStatus): string { return SURVEY_STATUS_BADGE[s] ?? 'badge-neutral'; }

export function calcResponseRate(survey: Survey): number {
  return survey.totalRecipients
    ? Math.round((survey.responses / survey.totalRecipients) * 100)
    : 0;
}
