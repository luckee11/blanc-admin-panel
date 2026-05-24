import { IconName } from '../../shared/components/icon/icon.icons';

export interface NavChild {
  label: string;
  link: string;
}

export interface NavItem {
  label: string;
  icon: IconName;
  link?: string;
  exact?: boolean;
  children?: NavChild[];
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    group: 'Обзор',
    items: [{ label: 'Дашборд', icon: 'home', link: '/dashboard', exact: true }],
  },
  {
    group: 'Персонал',
    items: [
      {
        label: 'Сотрудники',
        icon: 'users',
        children: [
          { label: 'Трудоустроенные', link: '/employees/employed' },
          { label: 'Отделы', link: '/employees/departments' },
        ],
      },
    ],
  },
  {
    group: 'Развитие',
    items: [
      {
        label: 'ИПР',
        icon: 'target',
        children: [
          { label: 'Планы развития', link: '/ipr/plans' },
          { label: 'Задачи ИПР', link: '/ipr/tasks' },
          { label: 'Аналитика', link: '/ipr/analytics' },
        ],
      },
      { label: 'Опросники', icon: 'clipboard-list', link: '/surveys' },
      { label: 'Performance Review', icon: 'graduation', link: '/performance-review' },
    ],
  },
  {
    group: 'Коммуникации',
    items: [
      { label: 'Новости', icon: 'megaphone', link: '/news' },
      { label: 'Письма', icon: 'send', link: '/emails' },
    ],
  },
  {
    group: 'Администрирование',
    items: [{ label: 'Роли и права', icon: 'shield', link: '/roles' }],
  },
];
