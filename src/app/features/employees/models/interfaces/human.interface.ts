/** Сотрудник из api/humans/search */
export interface Human {
  id: string;
  fullName: string;
  position: string;
  squadName: string;
  status: string;
}

export interface HumansSearchRequest {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface HumansSearchResponse {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: Human[];
}

/** Отдел/группа из GET /api/admin/humans/{id} */
export interface HumanSquad {
  id: string;
  name: string;
}

/** Элемент списка GET /api/admin/humans/recent — недавно добавленные сотрудники. */
export interface RecentHuman {
  id: string;
  fullName: string;
  position: string;
  squadName: string;
  status: string;
  dateOfEmployment: string | null;
}

/** Тело запроса PATCH /api/admin/humans/{id} — частичное обновление сотрудника. */
export interface UpdateHumanRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;          // ISO-строка даты
  supervisorId?: string | null;
  main_supervisorId?: string | null;
  location?: string;
  region?: string;
  dn?: string;
  contactsId?: string;
  applicationUserId?: string;
  hireDate?: string;
  fireDate?: string;
  hireDateUtc?: string;
  image?: string | null;
  cityId?: string;
  sAMAccountName?: string;
  email?: string;
  groupId?: string | null;
  guidAD?: string | null;
}

/** Детальная карточка сотрудника — GET /api/admin/humans/{id} */
export interface HumanDetail {
  dn: string;
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  dateOfBirth: string | null;
  dateOfEmployment: string | null;
  email: string | null;
  phone: string | null;
  telegramId: string | null;
  location: string | null;
  image: string | null;
  position: string;
  status: string;
  vacationDays: string;
  squads: HumanSquad[];
  supervisorFullname: string | null;
  teammates: Partial<HumanDetail>[];
  timezone: number;
  current_level: string | null;
}
