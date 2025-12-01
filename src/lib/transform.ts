// src/lib/transform.ts

import type { Parent, Student } from "../types/api";

export const studentFromServer = (s: any): Student => ({
  id: s.id,
  firstName: s.firstName ?? s.first_name,
  lastName: s.lastName ?? s.last_name,
  birthDate: s.birthDate ?? s.birth_date,
  phone: s.phone,
  parentId: s.parentId ?? s.parent_id ?? (s.parent?.id ?? 0),
});

export const parentFromServer = (p: any): Parent => ({
  id: p.id,
  firstName: p.firstName ?? p.first_name,
  lastName: p.lastName ?? p.last_name,
  phone: p.phone,
  email: p.email,
  children: p.children ? p.children.map(studentFromServer) : undefined,
});

export const parentToServerCreate = (p: Partial<Parent>) => ({
  first_name: p.firstName,
  last_name: p.lastName,
  phone: p.phone,
  email: p.email,
});

export const studentToServerCreate = (s: Partial<Student>) => ({
  first_name: s.firstName,
  last_name: s.lastName,
  birth_date: s.birthDate,
  phone: s.phone,
  parent: s.parentId,
});
