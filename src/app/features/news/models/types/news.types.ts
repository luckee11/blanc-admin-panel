import { NewsStatus } from '../../enums/news-status.enum';

export type NewsFilterState = { search: string; status: NewsStatus | '' };
