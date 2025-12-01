import { useParams, useNavigate } from '@tanstack/react-router';
import { useParent, useUpdateParent } from '../api';
import { useStudents, useUpdateStudent } from '../../students/api';
import { useForm } from 'react-hook-form';
import { type ParentCreateForm, ParentUpdateSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { ErrorMessage } from '../../../components/ErrorMessage';

export function ParentEditPage() {
  const { parentId } = useParams({ from: '/parents/$parentId' });
  const id = Number(parentId);

  const { data: parent, isLoading, error: parentError } = useParent(id);
  const { data: students = [], error: studentsError } = useStudents();
  const updateParent = useUpdateParent();
  const updateStudent = useUpdateStudent();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ParentCreateForm>({
      resolver: zodResolver(ParentUpdateSchema),
    });

  useEffect(() => {
    if (parent) {
      reset({
        firstName: parent.firstName,
        lastName: parent.lastName,
        phone: parent.phone,
        email: parent.email,
      });
    }
  }, [parent, reset]);

  const onSubmit = (data: ParentCreateForm) => {
    updateParent.mutate(
      { id, data },
      { onSuccess: () => navigate({ to: '/parents' }) },
    );
  };

  const parentStudents = students.filter(student => student.parentId === id);

  const handleAddStudent = (studentId: number) => {
    updateStudent.mutate({
      id: studentId,
      data: { parentId: id },
    });
  };

  const handleRemoveStudent = (studentId: number) => {
    updateStudent.mutate({
      id: studentId,
      data: { parentId: null },
    });
  };

  if (isLoading || !parent) return <div>Завантаження...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Редагувати батька: {parent.firstName} {parent.lastName}
      </h1>

      {/* Render errors */}
      <ErrorMessage error={parentError} />
      <ErrorMessage error={studentsError} />
      <ErrorMessage error={updateParent.error} />
      <ErrorMessage error={updateStudent.error} />

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
          disabled={updateParent.isPending}
          type="submit"
        >
          {updateParent.isPending ? 'Збереження...' : 'Зберегти'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Діти</h2>
        {parentStudents.length > 0 ? (
          <ul className="space-y-2">
            {parentStudents.map(student => (
              <li key={student.id} className="flex justify-between items-center">
                <span>{student.firstName} {student.lastName}</span>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleRemoveStudent(student.id)}
                >
                  Видалити
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>У цього батька немає дітей.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Додати дитину</h2>
        <ul className="space-y-2">
          {students
            .filter(student => student.parentId !== id)
            .map(student => (
              <li key={student.id} className="flex justify-between items-center">
                <span>{student.firstName} {student.lastName}</span>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleAddStudent(student.id)}
                >
                  Додати
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
