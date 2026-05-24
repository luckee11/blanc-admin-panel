import {
  DevelopmentPlanItemStatusCounts,
  DevelopmentPlanStatusCounts,
} from '../../models/interfaces/development-plan-analytics.interface';

export interface PlanStatusMeta {
  key: keyof DevelopmentPlanStatusCounts;
  label: string;
  badge: string;
}

/** Статусы планов развития (для аналитики и latestPlanStatus). */
export const PLAN_STATUS_META: PlanStatusMeta[] = [
  { key: 'draft',       label: 'Черновик',   badge: 'badge-neutral' },
  { key: 'agreed',      label: 'Согласован', badge: 'badge-info' },
  { key: 'in_progress', label: 'В работе',   badge: 'badge-info' },
  { key: 'on_review',   label: 'На ревью',   badge: 'badge-warning' },
  { key: 'completed',   label: 'Завершён',   badge: 'badge-success' },
  { key: 'cancelled',   label: 'Отменён',    badge: 'badge-danger' },
];

export type TagSeverity = 'secondary' | 'info' | 'warn' | 'success' | 'danger';

export interface ItemStatusMeta {
  key: keyof DevelopmentPlanItemStatusCounts;
  label: string;
  badge: string;
  severity: TagSeverity;
}

/** Статусы пунктов плана развития (itemStatusCounts / items[].status). */
export const ITEM_STATUS_META: ItemStatusMeta[] = [
  { key: 'backlog',            label: 'Бэклог',           badge: 'badge-neutral',  severity: 'secondary' },
  { key: 'validatedByManager', label: 'Подтверждён рук.', badge: 'badge-info',     severity: 'info' },
  { key: 'inProgress',         label: 'В работе',         badge: 'badge-info',     severity: 'info' },
  { key: 'inReview',           label: 'На проверке',      badge: 'badge-warning',  severity: 'warn' },
  { key: 'acceptedByManager',  label: 'Принят рук.',      badge: 'badge-success',  severity: 'success' },
  { key: 'willNotBeDone',      label: 'Не будет выполнен', badge: 'badge-danger',  severity: 'danger' },
];

const ITEM_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  ITEM_STATUS_META.map((m) => [m.key, m.label]),
);
const ITEM_STATUS_SEVERITY: Record<string, TagSeverity> = Object.fromEntries(
  ITEM_STATUS_META.map((m) => [m.key, m.severity]),
);

export function itemStatusLabel(s: string): string { return ITEM_STATUS_LABELS[s] ?? s; }
export function itemStatusSeverity(s: string): TagSeverity { return ITEM_STATUS_SEVERITY[s] ?? 'secondary'; }

const PLAN_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  PLAN_STATUS_META.map((m) => [m.key, m.label]),
);
const PLAN_STATUS_BADGES: Record<string, string> = Object.fromEntries(
  PLAN_STATUS_META.map((m) => [m.key, m.badge]),
);

export function planStatusLabel(s: string): string { return PLAN_STATUS_LABELS[s] ?? s; }
export function planStatusBadge(s: string): string { return PLAN_STATUS_BADGES[s] ?? 'badge-neutral'; }
