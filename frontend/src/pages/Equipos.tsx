import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getEquipos, crearEquipo, eliminarEquipo, type Equipo } from "../api/equiposApi";
import { useNavigate } from "react-router-dom";

export default function Equipos() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarEquipos = async () => {
    try {
      if (!token) return;
      const lista = await getEquipos(token);
      setEquipos(lista);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      const nuevo = await crearEquipo(nombre, token!);
      setEquipos([...equipos, nuevo]);
      setNombre("");
    } catch (err) {
      alert("Error al crear equipo");
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro de eliminar este equipo?")) return;

    try {
      await eliminarEquipo(id, token!);
      setEquipos(equipos.filter((e) => e.id !== id));
    } catch {
      alert("Error al eliminar equipo");
    }
  };

  if (loading) return <p className="p-10">Cargando equipos...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Equipos</h1>

      {/* Crear equipo */}
      <form onSubmit={handleCrear} className="mb-8 flex gap-3">
        <input
          className="border p-2 rounded w-64"
          placeholder="Nombre del equipo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 rounded">
          Crear
        </button>
      </form>

      {/* Listado */}
      <div className="space-y-3">
        {equipos.length === 0 ? (
          <p className="text-gray-500">No hay equipos.</p>
        ) : (
          equipos.map((eq) => (
            <div
              key={eq.id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{eq.nombre}</p>
                <p className="text-sm text-gray-600">
                  Creado el {new Date(eq.fechaCreacion).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3">
                {/* Ver miembros */}
                <button
                  onClick={() => navigate(`/equipos/${eq.id}/miembros`)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Miembros
                </button>

                {/* Eliminar */}
                <button
                  onClick={() => handleEliminar(eq.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
