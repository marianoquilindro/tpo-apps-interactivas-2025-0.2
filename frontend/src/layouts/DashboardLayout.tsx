import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-700 text-white p-6 flex flex-col shadow-xl">

        <h2 className="text-2xl font-bold mb-8">Mi Panel</h2>

        <nav className="flex flex-col gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `py-2 px-3 rounded-lg transition text-left ${
                isActive ? "bg-blue-900 font-semibold" : "hover:bg-blue-800"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/equipos"
            className={({ isActive }) =>
              `py-2 px-3 rounded-lg transition text-left ${
                isActive ? "bg-blue-900 font-semibold" : "hover:bg-blue-800"
              }`
            }
          >
            Equipos
          </NavLink>

          <NavLink
            to="/tareas"
            className={({ isActive }) =>
              `py-2 px-3 rounded-lg transition text-left ${
                isActive ? "bg-blue-900 font-semibold" : "hover:bg-blue-800"
              }`
            }
          >
            Tareas
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg font-semibold transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Hola, {user?.nombre || "usuario"} 👋
        </h1>

        <Outlet />
      </main>
    </div>
  );
}
