import { StatusPR } from '../../enums/status-pr.enum';

/** Лёгкая ссылка на связанную сущность в ответе GET /api/admin/performance-reviews. */
export interface EntityRef {
  id: string;
}

/**
 * Performance review — элемент ответа GET /api/admin/performance-reviews.
 * Соответствует backend-сущности `performance_review`.
 */
export interface PerformanceReview {
  id: string;
  /** ISO-дата начала цикла; null, если не задана. */
  startDate: string | null;
  /** ISO-дата окончания цикла; null, если не задана. */
  endDate: string | null;
  status: StatusPR;
  /** Участники ревью (humanPerformanceReviews). */
  humanPerformanceReviews?: EntityRef[];
  /** Опросники ревью (prQuestionnaires). */
  prQuestionnaires?: EntityRef[];
  /** Связанные анкеты (questionnaires). */
  questionnaires?: EntityRef[];
}
