// src/routes/parents.$parentId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ParentEditPage } from '../../features/parents/pages/ParentEditPage';

export const Route = createFileRoute('/parents/$parentId')({
  component: ParentEditPage,
});
