import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  getMiembrosEquipo,
  agregarMiembroEquipo,
  eliminarMiembroEquipo,
  getEquipos
} from "../api/equiposApi";

export default function MiembrosEquipo() {
  const { id } = useParams();
  const { token } = useAuth();

  const [equipoNombre, setEquipoNombre] = useState("");
  const [miembros, setMiembros] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      if (!token) return;

      // Obtener nombre
      const equipos = await getEquipos(token);
      const equipo = equipos.find((e) => e.id === Number(id));
      setEquipoNombre(equipo?.nombre ?? "");

      // Obtener miembros
      const lista = await getMiembrosEquipo(Number(id), token);

      // Normalizar
      const normalizados = lista.map((m: any) => ({
        ...m,
        usuario: m.usuario ?? {
          nombre: "Usuario desconocido",
          email: "sin-email"
        }
      }));

      setMiembros(normalizados);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const nuevo = await agregarMiembroEquipo(
        Number(id),
        email,
        "Miembro",
        token!
      );

      const normalizado = {
        ...nuevo,
        usuario: nuevo.usuario ?? {
          nombre: "Usuario desconocido",
          email
        }
      };

      setMiembros([...miembros, normalizado]);
      setEmail("");
    } catch {
      alert("Error al agregar miembro");
    }
  };

  const handleEliminar = async (membresiaId: number) => {
    if (!confirm("¿Eliminar miembro?")) return;

    try {
      await eliminarMiembroEquipo(Number(id), membresiaId, token!);
      setMiembros(miembros.filter((m) => m.id !== membresiaId));
    } catch {
      alert("Error al eliminar miembro");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Miembros de {equipoNombre}
      </h1>

      {/* AGREGAR */}
      <form onSubmit={handleAgregar} className="mb-6 flex gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Email del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded">
          Agregar
        </button>
      </form>

      {/* LISTA */}
      <div className="space-y-3">
        {miembros.map((m) => (
          <div
            key={m.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{m.usuario.nombre}</p>
              <p className="text-gray-600 text-sm">{m.usuario.email}</p>
              <p className="italic text-sm">{m.rol}</p>
            </div>

            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => handleEliminar(m.id)}
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
