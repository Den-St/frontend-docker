// src/features/parents/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import apiClient from '../../lib/axios';
import type { Parent } from '../../types/api';
import { parentFromServer, parentToServerCreate } from '../../lib/transform';

const getParents = async (): Promise<Array<Parent>> => {
  const res: AxiosResponse = await apiClient.get('/parents');
  // Може повернутися масив з snake_case або camelCase
  return (res.data || []).map(parentFromServer);
};

const getParentById = async (id: number): Promise<Parent> => {
  const res = await apiClient.get(`/parents/${id}`);
  return parentFromServer(res.data);
};

const createParent = async (payload: Partial<Parent>): Promise<Parent> => {
  const body = parentToServerCreate(payload);
  const res = await apiClient.post('/parents', body);
  return parentFromServer(res.data);
};

const updateParent = async ({ id, data }: { id: number; data: Partial<Parent> }): Promise<Parent> => {
  const snake = {
    ...(data.firstName !== undefined && { first_name: data.firstName }),
    ...(data.lastName !== undefined && { last_name: data.lastName }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.email !== undefined && { email: data.email }),
  };
  const res = await apiClient.put(`/parents/${id}`, snake);
  return parentFromServer(res.data);
};

const deleteParent = async (id: number): Promise<void> => {
  await apiClient.delete(`/parents/${id}`);
};

const addParentToStudents = async ({ parentId, studentIds }: { parentId: number; studentIds: Array<number> }): Promise<void> => {
  await apiClient.post(`/parents/${parentId}/students`, { student_ids: studentIds });
};

// React hooks
export const useParents = () => useQuery<Array<Parent>>({ queryKey: ['parents'], queryFn: getParents });
export const useParent = (id?: number) => useQuery<Parent>({ queryKey: ['parents', id], queryFn: () => getParentById(id!), enabled: !!id });
export const useCreateParent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Parent>) => createParent(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parents'] });
    },
  });
};

export const useUpdateParent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Parent> }) =>
      updateParent({ id, data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parents'] });
    },
  });
};

export const useDeleteParent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteParent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parents'] });
    },
  });
};

export const useAddParentToStudents = () => {
  return useMutation({
    mutationFn: ({ parentId, studentIds }: { parentId: number; studentIds: Array<number> }) =>
      addParentToStudents({ parentId, studentIds }),
  });
};

