const API_URL = "http://localhost:4000/api";

export interface Equipo {
  id: number;
  nombre: string;
  fechaCreacion: string;
}

export async function getEquipos(token: string): Promise<Equipo[]> {
  const res = await fetch(`${API_URL}/equipos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener equipos");
  }

  return await res.json();
}

export async function crearEquipo(nombre: string, token: string): Promise<Equipo> {
  const res = await fetch(`${API_URL}/equipos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre }),
  });

  if (!res.ok) {
    throw new Error("Error al crear equipo");
  }

  return await res.json();
}

export async function eliminarEquipo(id: number, token: string) {
  const res = await fetch(`http://localhost:4000/api/equipos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  if (!res.ok) throw new Error("Error al eliminar equipo");
  return true;
}
