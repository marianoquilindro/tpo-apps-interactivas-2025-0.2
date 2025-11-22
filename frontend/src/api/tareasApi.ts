const API_URL = "http://localhost:4000/api";

export async function getTareas(token: string) {
  const res = await fetch(`${API_URL}/tareas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
}

export async function crearTarea(token: string, body: any) {
  const res = await fetch(`${API_URL}/tareas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
}

export async function actualizarEstado(token: string, id: number, estado: string) {
  const res = await fetch(`${API_URL}/tareas/${id}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  if (!res.ok) throw new Error("Error al actualizar estado");
  return res.json();
}

export async function borrarTarea(token: string, id: number) {
  const res = await fetch(`${API_URL}/tareas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al eliminar tarea");
}

export async function obtenerTarea(token: string, id: number) {
  const res = await fetch(`${API_URL}/tareas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener la tarea");
  return res.json();
}