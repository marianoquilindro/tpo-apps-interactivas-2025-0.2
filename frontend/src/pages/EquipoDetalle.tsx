import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMiembrosEquipo, agregarMiembroEquipo } from "../api/equiposApi";

export default function EquipoDetalle() {
  const { id } = useParams();
  const { token } = useAuth();

  const [miembros, setMiembros] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("Miembro");

  const cargarMiembros = async () => {
    if (!token) return;

    const data = await getMiembrosEquipo(Number(id), token);

    const normalizados = data.map((m: any) => ({
      ...m,
      usuario: m.usuario ?? {
        nombre: "Usuario desconocido",
        email: "sin-email"
      }
    }));

    setMiembros(normalizados);
  };

  useEffect(() => {
    cargarMiembros();
  }, []);

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await agregarMiembroEquipo(Number(id), email, rol, token!);
      setEmail("");
      cargarMiembros();
    } catch {
      alert("No se pudo agregar el miembro");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Miembros del equipo</h1>

      <form onSubmit={handleAgregar} className="mb-6 flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Email del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="Miembro">Miembro</option>
          <option value="Propietario">Propietario</option>
        </select>

        <button className="bg-blue-600 text-white px-4 rounded">
          Agregar
        </button>
      </form>

      <div className="space-y-3">
        {miembros.map((m) => (
          <div key={m.id} className="border p-3 rounded shadow">
            <p className="font-bold">{m.usuario.nombre}</p>
            <p className="text-sm text-gray-600">{m.usuario.email}</p>
            <p className="text-sm">Rol: {m.rol}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
