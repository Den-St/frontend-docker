// src/features/parents/schemas.ts
import { z } from 'zod';

export const ParentCreateSchema = z.object({
  firstName: z.string().min(1, 'Імʼя обовʼязкове').max(50),
  lastName: z.string().min(1, 'Прізвище обовʼязкове').max(50),
  phone: z.string().min(5, 'Телефон обовʼязковий').max(20),
  email: z.string().email('Невірний email').max(100),
});

export const ParentUpdateSchema = ParentCreateSchema;
export type ParentCreateForm = z.infer<typeof ParentUpdateSchema>;
