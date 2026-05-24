import { NewsStatus } from '../../enums/news-status.enum';
import { NEWS_STATUS_BADGE, NEWS_STATUS_LABELS } from '../constants/news-status.constants';

export function getNewsStatusLabel(s: NewsStatus): string { return NEWS_STATUS_LABELS[s] ?? s; }
export function getNewsStatusBadge(s: NewsStatus): string { return NEWS_STATUS_BADGE[s] ?? 'badge-neutral'; }
