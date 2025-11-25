// src/api/notificacionesApi.ts
const API_URL = "http://localhost:4000/api";

export async function getNotificaciones(token: string, mostrarLeidas = false) {
  const res = await fetch(
    `${API_URL}/notificaciones?leidas=${mostrarLeidas}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Error al obtener notificaciones");
  return res.json();
}

export async function marcarComoLeidas(token: string, ids: number[]) {
  const res = await fetch(`${API_URL}/notificaciones/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) throw new Error("Error al marcar como leídas");
  return res.json();
}
