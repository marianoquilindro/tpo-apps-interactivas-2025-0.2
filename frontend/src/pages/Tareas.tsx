import { useEffect, useState } from "react";
import { type Tarea } from "../types/Tarea";
import { useAuth } from "../context/AuthContext";
import {
  getTareas,
  crearTarea,
  actualizarEstado,
  borrarTarea,
} from "../api/tareasApi";
import { getEquipos } from "../api/equiposApi";

export default function Tareas() {
  const { token } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);

  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");

  const [formCrear, setFormCrear] = useState({
    titulo: "",
    descripcion: "",
    prioridad: "Media",
    equipoId: "",
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [editEstado, setEditEstado] = useState<string>("");

  const cargar = async () => {
    if (!token) return;
    const data = await getTareas(token);
    setTareas(data);

    const equiposData = await getEquipos(token);
    setEquipos(equiposData);
  };

  useEffect(() => {
    cargar();
  }, [token]);

  const handleCrear = async () => {
    try {
      await crearTarea(token!, {
        titulo: formCrear.titulo,
        descripcion: formCrear.descripcion,
        prioridad: formCrear.prioridad,
        equipoId: Number(formCrear.equipoId),
      });
      setFormCrear({
        titulo: "",
        descripcion: "",
        prioridad: "Media",
        equipoId: "",
      });
      cargar();
    } catch (err) {
      alert("Error al crear tarea");
      console.error(err);
    }
  };

  const handleEditarEstado = async () => {
    if (!editId) return;
    try {
      await actualizarEstado(token!, editId, editEstado);
      setEditId(null);
      cargar();
    } catch (err) {
      alert("Error al editar estado");
      console.error(err);
    }
  };

  const handleBorrar = async (id: number) => {
    if (!confirm("¿Eliminar tarea?")) return;
    await borrarTarea(token!, id);
    cargar();
  };

  const tareasFiltradas = tareas.filter((t) => {
    return (
      t.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) &&
      (filtroEstado ? t.estado === filtroEstado : true) &&
      (filtroPrioridad ? t.prioridad === filtroPrioridad : true)
    );
  });

  return (
    // 🔥 SOLO ESTA LÍNEA SE MODIFICÓ PARA ARREGLAR EL LAYOUT
    <div className="p-6 max-w-5xl mx-auto">

      {/* --- FORM CREAR --- */}
      <div className="bg-white p-4 rounded shadow mb-6 w-full max-w-xl">
        <h2 className="font-bold text-xl mb-3">Crear nueva tarea</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Título"
          value={formCrear.titulo}
          onChange={(e) =>
            setFormCrear({ ...formCrear, titulo: e.target.value })
          }
        />

        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Descripción"
          value={formCrear.descripcion}
          onChange={(e) =>
            setFormCrear({ ...formCrear, descripcion: e.target.value })
          }
        />

        <select
          className="border p-2 w-full mb-2"
          value={formCrear.prioridad}
          onChange={(e) =>
            setFormCrear({ ...formCrear, prioridad: e.target.value })
          }
        >
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        <select
          className="border p-2 w-full mb-2"
          value={formCrear.equipoId}
          onChange={(e) =>
            setFormCrear({ ...formCrear, equipoId: e.target.value })
          }
        >
          <option value="">Seleccionar equipo</option>
          {equipos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>

        <button
          onClick={handleCrear}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear tarea
        </button>
      </div>

      {/* --- FILTROS --- */}
      <div className="flex gap-4 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Buscar por título"
          value={filtroTitulo}
          onChange={(e) => setFiltroTitulo(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Estado</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_CURSO">En curso</option>
          <option value="FINALIZADA">Finalizada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filtroPrioridad}
          onChange={(e) => setFiltroPrioridad(e.target.value)}
        >
          <option value="">Prioridad</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      {tareasFiltradas.length === 0 && (
        <p className="text-gray-600 italic">No hay tareas para mostrar.</p>
      )}

      <div className="space-y-3">
        {tareasFiltradas.map((t) => (
          <div key={t.id} className="border p-3 rounded bg-gray-50 w-full max-w-3xl">

            <h2 className="text-xl font-bold">{t.titulo}</h2>
            <p>{t.descripcion}</p>

            <p className="text-sm mt-2">
              <span className="font-semibold">Estado:</span> {t.estado}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Prioridad:</span> {t.prioridad}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Equipo:</span>{" "}
              {t.equipo?.nombre ?? "Sin equipo"}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Creada:</span>{" "}
              {new Date(t.fechaCreacion ?? t.createdAt!).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  setEditId(t.id);
                  setEditEstado(t.estado);
                }}
              >
                Editar estado
              </button>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleBorrar(t.id)}
              >
                Borrar
              </button>

              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => window.location.href = `/tareas/${t.id}`}
              >
                Ver detalle
              </button>
            </div>

            {editId === t.id && (
              <div className="mt-3 bg-white border p-3 rounded shadow">
                <h3 className="font-bold mb-2">Editar estado</h3>

                <select
                  className="border p-2 w-full mb-2"
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value)}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_CURSO">En curso</option>
                  <option value="FINALIZADA">Finalizada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>

                <button
                  className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                  onClick={handleEditarEstado}
                >
                  Guardar
                </button>

                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setEditId(null)}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
