import { Permission } from '../../models/interfaces/permission.interface';

export const ALL_PERMISSIONS: Permission[] = [
  { id: 'p1', code: 'employees.view', name: 'Просмотр сотрудников', group: 'Сотрудники' },
  { id: 'p2', code: 'employees.edit', name: 'Редактирование сотрудников', group: 'Сотрудники' },
  { id: 'p3', code: 'employees.delete', name: 'Удаление сотрудников', group: 'Сотрудники' },
  { id: 'p4', code: 'ad.view', name: 'Просмотр AD', group: 'Active Directory' },
  { id: 'p5', code: 'ad.sync', name: 'Синхронизация AD', group: 'Active Directory' },
  { id: 'p6', code: 'ipr.view', name: 'Просмотр ИПР', group: 'ИПР' },
  { id: 'p7', code: 'ipr.edit', name: 'Редактирование ИПР', group: 'ИПР' },
  { id: 'p8', code: 'ipr.approve', name: 'Согласование ИПР', group: 'ИПР' },
  { id: 'p9', code: 'surveys.view', name: 'Просмотр опросов', group: 'Опросы' },
  { id: 'p10', code: 'surveys.manage', name: 'Управление опросами', group: 'Опросы' },
  { id: 'p11', code: 'news.publish', name: 'Публикация новостей', group: 'Контент' },
  { id: 'p12', code: 'emails.send', name: 'Отправка рассылок', group: 'Контент' },
  { id: 'p13', code: 'roles.manage', name: 'Управление ролями', group: 'Безопасность' },
  { id: 'p14', code: 'audit.view', name: 'Просмотр аудита', group: 'Безопасность' },
];
