// src/features/students/pages/StudentCreatePage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type StudentCreateForm, StudentCreateSchema } from '../schemas';
import { useCreateStudent } from '../api';
import { useNavigate } from '@tanstack/react-router';
import { useParents } from '../../parents/api';
import { ErrorMessage } from '../../../components/ErrorMessage';

export function StudentCreatePage() {
  const { data: parents, error: parentsError } = useParents();
  const create = useCreateStudent();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<StudentCreateForm>({
    resolver: zodResolver(StudentCreateSchema),
    defaultValues: {
      birthDate: '',
      firstName: '',
      lastName: '',
      phone: '',
      parentId: undefined,
    }
  });

  const onSubmit = (data: StudentCreateForm) => {
    create.mutate(data, {
      onSuccess: () => navigate({ to: '/students' }),
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Додати студента</h1>

      {/* Render errors */}
      <ErrorMessage error={parentsError} />
      <ErrorMessage error={create.error} />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='firstName'>Ім'я</label>
          <input {...register('firstName')} className="w-full p-2 border rounded" />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor='lastName'>Прізвище</label>
          <input {...register('lastName')} className="w-full p-2 border rounded" />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>
        <div>
          <label htmlFor='birthDate'>Дата народження (YYYY-MM-DD)</label>
          <input {...register('birthDate')} className="w-full p-2 border rounded" placeholder="2008-09-15" />
          {errors.birthDate && <p className="text-red-500">{errors.birthDate.message}</p>}
        </div>
        <div>
          <label htmlFor='phone'>Телефон</label>
          <input {...register('phone')} className="w-full p-2 border rounded" />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor='parentId'>Батько</label>
          <select {...register('parentId', { valueAsNumber: true })} className="w-full p-2 border rounded">
            <option value="">Оберіть батька</option>
            {parents?.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>)}
          </select>
          {errors.parentId && <p className="text-red-500">{errors.parentId.message}</p>}
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">
          {create.isPending ? 'Створюю...' : 'Створити'}
        </button>
      </form>
    </div>
  );
}
