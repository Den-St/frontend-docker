// src/routes/students.$studentId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { StudentEditPage } from '../../features/students/pages/StudentEditPage';

export const Route = createFileRoute('/students/$studentId')({
  component: StudentEditPage,
});
