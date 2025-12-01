// src/routes/parents.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ParentsListPage } from '../../features/parents/pages/ParentsListPage';

export const Route = createFileRoute('/parents/')({
  component: ParentsListPage,
});
