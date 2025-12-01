// src/features/students/schemas.ts
import { z } from 'zod';

export const StudentCreateSchema = z.object({
  firstName: z.string().min(1, 'Імʼя обовʼязкове').max(50),
  lastName: z.string().min(1, 'Прізвище обовʼязкове').max(50),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Очікується формат YYYY-MM-DD'),
  phone: z.string().min(8, 'Номер телефону має бути більшим за 8 символів').max(20, 'Номер телефону має бути меншим за 20 символів'),
  parentId: z.number().int().positive('Оберіть батька').nullable(),
});

export const StudentUpdateSchema = StudentCreateSchema.partial();
export type StudentUpdateForm = z.infer<typeof StudentUpdateSchema>;
export type StudentCreateForm = z.infer<typeof StudentCreateSchema>;
