const API_URL = "http://localhost:4000/api";



export interface UsuarioMiembro {
  id: number;
  email: string;
  nombre: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface MiembroEquipo {
  id: number;
  rol: string;
  usuarioId: number;
  equipoId: number;
  usuario: UsuarioMiembro;
}

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

export async function getMiembrosEquipo(
  equipoId: number,
  token: string
): Promise<MiembroEquipo[]> {
  const res = await fetch(`${API_URL}/equipos/${equipoId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
   console.log("STATUS miembros:", res.status);

  const data = await res.json();
  console.log("DATA miembros:", data);
  
  if (!res.ok) throw new Error("Error al obtener miembros");
  return res.json();
}

export async function agregarMiembroEquipo(
  equipoId: number,
  email: string,
  rol: string,
  token: string
) {
  const res = await fetch(`${API_URL}/equipos/${equipoId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ email, rol })
  });

  if (!res.ok) throw new Error("Error al agregar miembro");
  return res.json();
}

export async function getEquipoPorId(id: number, token: string) {
  const res = await fetch(`${API_URL}/equipos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener equipo");
  return res.json();
}


export async function eliminarMiembroEquipo(
  equipoId: number,
  membresiaId: number,
  token: string
) {
  const res = await fetch(`${API_URL}/equipos/${equipoId}/members/${membresiaId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al eliminar miembro");
  return true;
}

