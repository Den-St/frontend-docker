import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <nav className="p-4 border-b border-gray-300">
        <ul className="list-none flex gap-4 p-0">
          <li>
            <Link
              to="/students"
              className="text-blue-500 font-bold hover:underline"
            >
              Список студентів
            </Link>
          </li>
          <li>
            <Link
              to="/students/create"
              className="text-blue-500 font-bold hover:underline"
            >
              Додати студента
            </Link>
          </li>
          <li>
            <Link
              to="/parents"
              className="text-blue-500 font-bold hover:underline"
            >
              Список батьків
            </Link>
          </li>
          <li>
            <Link
              to="/parents/create"
              className="text-blue-500 font-bold hover:underline"
            >
              Додати батьків
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  ),
});