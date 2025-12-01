// src/routes/students.tsx
import { createFileRoute } from '@tanstack/react-router';
import { StudentsListPage } from '../../features/students/pages/StudentsListPage';

export const Route = createFileRoute('/students/')({
  component: StudentsListPage,
});
