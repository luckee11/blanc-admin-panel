import { SurveyStatus } from '../../enums/survey-status.enum';

export type SurveyFilterState = {
  search: string;
  status: SurveyStatus | '';
};
