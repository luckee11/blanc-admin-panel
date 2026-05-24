/** Статусы пункта плана развития (DevelopmentPlanItemStatus). */
export enum DevelopmentPlanItemStatus {
  Backlog = 'backlog',
  ValidatedByManager = 'validatedByManager',
  InProgress = 'inProgress',
  InReview = 'inReview',
  AcceptedByManager = 'acceptedByManager',
  WillNotBeDone = 'willNotBeDone',
}
