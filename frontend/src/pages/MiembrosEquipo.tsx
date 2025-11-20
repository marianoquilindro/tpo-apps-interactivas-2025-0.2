import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface Miembro {
  id: number;
  nombre: string;
}

export default function MiembrosEquipo() {
  const { id } = useParams();
  const { token } = useAuth();

  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [nombre, setNombre] = useState("");

  const cargarMiembros = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/equipos/${id}/miembros`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error al cargar miembros");

      const data = await res.json();
      setMiembros(data);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar los miembros.");
    }
  };

  const agregarMiembro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      const res = await fetch(`http://localhost:4000/api/equipos/${id}/miembros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre })
      });

      if (!res.ok) throw new Error("No se pudo agregar");

      setNombre("");
      await cargarMiembros();
    } catch (err) {
      console.error(err);
      alert("Error al agregar miembro");
    }
  };

  useEffect(() => {
    if (id) cargarMiembros();
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Miembros del Equipo {id}</h1>

      {/* Agregar miembro */}
      <form onSubmit={agregarMiembro} className="flex gap-3 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Nombre del miembro"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-3 py-1 rounded">
          Agregar
        </button>
      </form>

      {/* Listado */}
      <ul className="space-y-2">
        {miembros.map((m) => (
          <li key={m.id} className="border p-3 rounded">
            {m.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
