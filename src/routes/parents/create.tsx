// src/routes/parents.new.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ParentCreatePage } from '../../features/parents/pages/ParentCreatePage';

export const Route = createFileRoute('/parents/create')({
  component: ParentCreatePage,
});
