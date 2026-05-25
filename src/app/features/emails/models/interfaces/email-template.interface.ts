/** Шаблон письма — сущность email_templates (GET /api/admin/emails). */
export interface EmailTemplate {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  /** HTML-тело письма (из редактора p-editor / Quill). */
  body: string;
  createdAt?: string;
  updatedAt?: string;
}
