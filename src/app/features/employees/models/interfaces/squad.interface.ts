/** Человек (руководитель/куратор) в ответе GET /api/admin/squads. */
export interface SquadPerson {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string | null;
  fullName: string;
}

/** Отдел/группа — элемент ответа GET /api/admin/squads. */
export interface Squad {
  id: string;
  name: string;
  employeeCount: number;
  supervisor: SquadPerson | null;
  curator: SquadPerson | null;
}
