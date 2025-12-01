// src/types/api.ts
export type Parent = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  children?: Array<Student>;
};

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO string yyyy-mm-dd
  phone: string;
  parentId: number | null;
};
