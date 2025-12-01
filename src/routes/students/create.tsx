// src/routes/students.new.tsx
import { createFileRoute } from '@tanstack/react-router';
import { StudentCreatePage } from '../../features/students/pages/StudentCreatePage';

export const Route = createFileRoute('/students/create')({
  component: StudentCreatePage,
});
