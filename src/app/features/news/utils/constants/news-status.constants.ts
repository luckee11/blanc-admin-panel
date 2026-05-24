import { NewsStatus } from '../../enums/news-status.enum';

export const NEWS_STATUS_LABELS: Record<NewsStatus, string> = {
  [NewsStatus.Draft]: 'Черновик',
  [NewsStatus.Scheduled]: 'Запланировано',
  [NewsStatus.Published]: 'Опубликовано',
  [NewsStatus.Archived]: 'В архиве',
};

export const NEWS_STATUS_BADGE: Record<NewsStatus, string> = {
  [NewsStatus.Draft]: 'badge-neutral',
  [NewsStatus.Scheduled]: 'badge-info',
  [NewsStatus.Published]: 'badge-success',
  [NewsStatus.Archived]: 'badge-neutral',
};
