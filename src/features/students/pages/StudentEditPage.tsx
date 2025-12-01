import { useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStudent, useUpdateStudent } from '../api';
import { useParents } from '../../parents/api';
import  { type StudentUpdateForm, StudentUpdateSchema} from '../schemas';
import { ErrorMessage } from '../../../components/ErrorMessage';

export function StudentEditPage() {
  const { studentId } = useParams({ from: '/students/$studentId' });
  const navigate = useNavigate();
  const { data: student, error: studentError, isLoading } = useStudent(Number(studentId));
  const { data: parents, error: parentsError, isLoading: isParentsLoading } = useParents();
  const updateMutation = useUpdateStudent();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentUpdateForm>({
    resolver: zodResolver(StudentUpdateSchema),
  });

  useEffect(() => {
    if (student) {
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        phone: student.phone,
        parentId: student.parentId,
      });
    }
  }, [student, reset]);

  const onSubmit = (data: StudentUpdateForm) => {
    updateMutation.mutate(
      { id: Number(studentId), data },
      {
        onSuccess: () => {
          navigate({ to: '/students' });
        },
      }
    );
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Редагувати студента</h1>

      {/* Render errors */}
      <ErrorMessage error={studentError} />
      <ErrorMessage error={parentsError} />
      <ErrorMessage error={updateMutation.error} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">Ім'я</label>
          <input
            {...register('firstName')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">Прізвище</label>
          <input
            {...register('lastName')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Телефон</label>
          <input
            {...register('phone')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="parentId" className="block text-sm font-medium mb-1">Батько</label>
          <select
            {...register('parentId', { valueAsNumber: true })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Оберіть батька</option>
            {isParentsLoading ? (
              <option disabled>Завантаження...</option>
            ) : (
              parents?.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.firstName} {parent.lastName}
                </option>
              ))
            )}
          </select>
          {errors.parentId && <p className="text-red-500">{errors.parentId.message}</p>}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          type="submit"
        >
          Зберегти
        </button>
      </form>
    </div>
  );
}