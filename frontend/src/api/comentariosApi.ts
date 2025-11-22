const API_URL = "http://localhost:4000/api";

export async function getComentarios(token: string, tareaId: number) {
  const res = await fetch(`${API_URL}/tareas/${tareaId}/comentarios`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al cargar comentarios");
  return res.json();
}

export async function crearComentario(token: string, tareaId: number, contenido: string) {
  const res = await fetch(`${API_URL}/tareas/${tareaId}/comentarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contenido }),
  });

  if (!res.ok) throw new Error("Error al crear comentario");
  return res.json();
}
