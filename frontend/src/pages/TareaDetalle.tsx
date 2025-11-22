import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

interface Comentario {
  id: number;
  contenido: string;
  fechaCreacion: string;
  autor: {
    id: number;
    nombre: string;
    email: string;
  };
}

export default function TareaDetalle() {
  const { id } = useParams();
  const tareaId = Number(id);

  const [tarea, setTarea] = useState<any>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  useEffect(() => {
    cargarTarea();
    cargarComentarios();
  }, []);

  async function cargarTarea() {
    const res = await axiosClient.get(`/tareas/${tareaId}`);
    setTarea(res.data);
  }

  async function cargarComentarios() {
    const res = await axiosClient.get(`/tareas/${tareaId}/comentarios`);
    console.log("📌 Comentarios recibidos del backend:", res.data);
    setComentarios(res.data);
  }

  async function enviarComentario(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    await axiosClient.post(`/tareas/${tareaId}/comentarios`, {
      contenido: nuevoComentario,
    });

    setNuevoComentario("");
    cargarComentarios();
  }

  if (!tarea) return <div>Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{tarea.titulo}</h1>
      <p>{tarea.descripcion}</p>

      {/* Comentarios */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comentarios</h2>

        <div className="space-y-4">
          {comentarios.map((c) => (
            <div key={c.id} className="p-3 rounded bg-gray-100">
              <p className="font-medium">{c.autor?.nombre ?? "Desconocido"}</p>
              <p>{c.contenido}</p>
              <small className="text-sm text-gray-500">
                {new Date(c.fechaCreacion).toLocaleString()}
              </small>
            </div>
          ))}
        </div>

        <form onSubmit={enviarComentario} className="mt-4 flex gap-2">
          <input
            type="text"
            className="border p-2 flex-1"
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Enviar
          </button>
        </form>
      </section>
    </div>
  );
}
