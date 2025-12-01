import { Link } from '@tanstack/react-router';
import { useDeleteStudent, useStudents } from '../api';
import { ErrorMessage } from '../../../components/ErrorMessage';

export function StudentsListPage() {
  const { data: students, isLoading, error } = useStudents();
  const deleteMutation = useDeleteStudent();

  const handleDelete = (id: number) => {
    if (window.confirm('Видалити студента?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Студенти</h1>
        <Link className="bg-blue-500 text-white px-4 py-2 rounded" to="/students/create">Додати студента</Link>
      </div>

      {/* Render errors */}
      <ErrorMessage error={error} />
      <ErrorMessage error={deleteMutation.error} />

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Ім'я</th>
            <th className="py-2 px-4 border-b">Телефон</th>
            <th className="py-2 px-4 border-b">Батько (ID)</th>
            <th className="py-2 px-4 border-b">Дії</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((s) => (
            <tr key={s.id}>
              <td className="py-2 px-4 border-b">{s.firstName} {s.lastName}</td>
              <td className="py-2 px-4 border-b">{s.phone}</td>
              <td className="py-2 px-4 border-b text-center">{s.parentId}</td>
              <td className="py-2 px-4 border-b">
                <Link
                  className="mr-4 text-indigo-600"
                  params={{ studentId: String(s.id) }}
                  to="/students/$studentId"
                >
                  Редагувати
                </Link>
                <button
                  className="text-red-600"
                  onClick={() => { handleDelete(s.id); }}
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
