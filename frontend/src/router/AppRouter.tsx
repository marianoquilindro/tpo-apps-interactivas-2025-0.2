import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Equipos from "../pages/Equipos";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { type ReactNode } from "react";
import MiembrosEquipo from "../pages/MiembrosEquipo";
import EquipoDetalle from "../pages/EquipoDetalle";
import Tareas from "../pages/Tareas";



function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login público */}
        <Route path="/" element={<Login />} />

        {/* Todo lo que está con login usa DashboardLayout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="equipos" element={<Equipos />} />
          <Route path="equipos/:id" element={<EquipoDetalle />} />
          <Route path="tareas" element={<Tareas />} />

        </Route>

        <Route path="equipos/:id/miembros" element={<MiembrosEquipo />} />


      </Routes>
    </BrowserRouter>
  );
}
