// src/features/students/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import apiClient from '../../lib/axios';
import { studentFromServer, studentToServerCreate } from '../../lib/transform';
import type { Student } from '../../types/api';

const getStudents = async (): Promise<Array<Student>> => {
  const res: AxiosResponse = await apiClient.get('/students');
  return (res.data || []).map(studentFromServer);
};

const getStudentById = async (id: number): Promise<Student> => {
  const res = await apiClient.get(`/students/${id}`);
  return studentFromServer(res.data);
};

const createStudent = async (payload: Partial<Student>): Promise<Student> => {
  const body = studentToServerCreate(payload);
  const res = await apiClient.post('/students', body);
  return studentFromServer(res.data);
};

const updateStudent = async ({ id, data }: { id: number; data: Partial<Student> }): Promise<Student> => {
  const snake: any = {};
  if (data.firstName) snake.first_name = data.firstName;
  if (data.lastName) snake.last_name = data.lastName;
  if (data.birthDate) snake.birth_date = data.birthDate;
  if (data.phone) snake.phone = data.phone;
  if (data.parentId !== undefined) snake.parent = data.parentId; // allow 0-case
  const res = await apiClient.put(`/students/${id}`, snake);
  return studentFromServer(res.data);
};

const deleteStudent = async (id: number): Promise<void> => {
  await apiClient.delete(`/students/${id}`);
};

const assignParentToStudents = async ({ parentId, studentIds }: { parentId: number; studentIds: Array<number> }): Promise<void> => {
  await apiClient.post('/students/assign-parent', { parentId, studentIds });
};

const getStudentsWithoutParent = async (): Promise<Array<Student>> => {
  const res: AxiosResponse = await apiClient.get('/students/without-parent');
  return (res.data || []).map(studentFromServer);
};

// ✅ React Query hooks
export const useStudents = () =>
  useQuery<Array<Student>>({
    queryKey: ['students'],
    queryFn: getStudents,
  });

export const useStudent = (id?: number) =>
  useQuery<Student>({
    queryKey: ['students', id],
    queryFn: () => getStudentById(id!),
    enabled: !!id,
  });

export const useCreateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Student>) => createStudent(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
};

export const useUpdateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: Partial<Student> }) =>
      updateStudent(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
};

export const useDeleteStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
};

export const useAssignParentToStudents = () => {
  return useMutation({
    mutationFn: ({ parentId, studentIds }: { parentId: number; studentIds: Array<number> }) =>
      assignParentToStudents({ parentId, studentIds }),
  });
};

export const useStudentsWithoutParent = () =>
  useQuery<Array<Student>>({
    queryKey: ['students', 'without-parent'],
    queryFn: getStudentsWithoutParent,
  });
