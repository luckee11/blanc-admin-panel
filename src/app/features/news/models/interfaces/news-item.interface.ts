import { NewsStatus } from '../../enums/news-status.enum';

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  cover?: string;
  status: NewsStatus;
  author: string;
  publishDate: string;
  views?: number;
  pinned?: boolean;
}
