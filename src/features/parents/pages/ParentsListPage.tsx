import { Link } from '@tanstack/react-router';
import { useDeleteParent, useParents } from '../api';
import { ErrorMessage } from '../../../components/ErrorMessage';

export function ParentsListPage() {
  const { data: parents, isLoading, error } = useParents();
  const deleteMutation = useDeleteParent();

  const handleDelete = (id: number) => {
    if (window.confirm('Видалити батька?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Батьки</h1>
        <Link className="bg-blue-500 text-white px-4 py-2 rounded" to="/parents/create">
          Додати батька
        </Link>
      </div>

      {/* Render errors */}
      <ErrorMessage error={error} />
      <ErrorMessage error={deleteMutation.error} />

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Ім'я</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Телефон</th>
            <th className="py-2 px-4 border-b">К-сть дітей</th>
            <th className="py-2 px-4 border-b">Дії</th>
          </tr>
        </thead>
        <tbody>
          {parents?.map((p) => (
            <tr key={p.id}>
              <td className="py-2 px-4 border-b">{p.firstName} {p.lastName}</td>
              <td className="py-2 px-4 border-b">{p.email}</td>
              <td className="py-2 px-4 border-b">{p.phone}</td>
              <td className="py-2 px-4 border-b text-center">{p.children?.length ?? 0}</td>
              <td className="py-2 px-4 border-b">
                <Link
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                  params={{ parentId: String(p.id) }}
                  to="/parents/$parentId"
                >
                  Редагувати
                </Link>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => { handleDelete(p.id); }}
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
