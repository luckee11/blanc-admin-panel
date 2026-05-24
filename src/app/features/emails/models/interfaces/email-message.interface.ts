import { EmailStatus } from '../../enums/email-status.enum';

export interface EmailMessage {
  id: string;
  subject: string;
  body: string;
  recipients: string;
  recipientCount: number;
  status: EmailStatus;
  sentAt?: string;
  scheduledAt?: string;
  author: string;
  template?: string;
}

export interface AudienceOption {
  value: string;
  label: string;
  count: number;
}
