export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  parent?: string;
  headcount: number;
  description?: string;
}
