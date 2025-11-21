export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "PENDIENTE" | "EN_CURSO" | "FINALIZADA" | "CANCELADA";
  prioridad: "Alta" | "Media" | "Baja";
  equipo?: {
    id: number;
    nombre: string;
  } | null;
  fechaCreacion?: string;
  createdAt?: string;
}
