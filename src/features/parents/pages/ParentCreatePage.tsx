import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ParentCreateForm, ParentCreateSchema } from '../schemas';
import { useCreateParent } from '../api';
import { useNavigate } from '@tanstack/react-router';
import { useAssignParentToStudents, useStudentsWithoutParent } from '../../students/api';
import { useState } from 'react';
import { ErrorMessage } from '../../../components/ErrorMessage';

export function ParentCreatePage() {
  const navigate = useNavigate();
  const createParent = useCreateParent();
  const assignParentToStudents = useAssignParentToStudents();
  const { data: students = [], error: studentsError } = useStudentsWithoutParent();

  const [selectedStudentIds, setSelectedStudentIds] = useState<Array<number>>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<ParentCreateForm>({
    resolver: zodResolver(ParentCreateSchema),
  });

  const onSubmit = (data: ParentCreateForm) => {
    createParent.mutate(data, {
      onSuccess: (newParent) => {
        if (selectedStudentIds.length > 0) {
          assignParentToStudents.mutate(
            { parentId: newParent.id, studentIds: selectedStudentIds },
            {
              onSuccess: () => navigate({ to: '/parents' }),
            }
          );
        } else {
          navigate({ to: '/parents' });
        }
      },
    });
  };

  const handleAddStudent = (studentId: number) => {
    setSelectedStudentIds((prev) => [...prev, studentId]);
  };

  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Додати батька</h1>

      {/* Render errors */}
      <ErrorMessage error={studentsError} />
      <ErrorMessage error={createParent.error} />
      <ErrorMessage error={assignParentToStudents.error} />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName">Ім'я</label>
          <input {...register('firstName')} className="w-full p-2 border rounded" />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>

        <div>
          <label htmlFor="lastName">Прізвище</label>
          <input {...register('lastName')} className="w-full p-2 border rounded" />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input {...register('email')} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone">Телефон</label>
          <input {...register('phone')} className="w-full p-2 border rounded" />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={createParent.isPending}
          type="submit"
        >
          {createParent.isPending ? 'Створення...' : 'Створити'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Додати дітей</h2>
        <ul className="space-y-2">
          {students.map((student) => (
            <li key={student.id} className="flex justify-between items-center">
              <span>{student.firstName} {student.lastName}</span>
              {selectedStudentIds.includes(student.id) ? (
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleRemoveStudent(student.id)}
                >
                  Видалити
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleAddStudent(student.id)}
                >
                  Додати
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
