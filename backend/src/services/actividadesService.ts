// src/services/actividadesService.ts
import { AppDataSource } from "../data-source";
import { Actividad } from "../entities/Actividad";
import { Tarea } from "../entities/Tarea";
import { equiposService } from "./equiposService";

const actividadRepo = AppDataSource.getRepository(Actividad);
const tareaRepo = AppDataSource.getRepository(Tarea);

class ActividadesService {
  async obtenerHistorialPorTarea(tareaId: number, usuarioId: number) {
    // 1. Obtener la tarea (para conocer el equipoId)
    const tarea = await tareaRepo.findOne({
      where: { id: tareaId },
      select: ["id", "equipoId"],
    });

    if (!tarea) throw { status: 404, message: "Tarea no encontrada." };

    // 2. Verificar que el usuario sea miembro del equipo
    await equiposService.verificarPermiso(usuarioId, tarea.equipoId, "Miembro");

    // 3. Devolver las actividades ordenadas por fecha descendente
    return actividadRepo.find({
      where: { tareaId },
      relations: ["usuario"],
      order: { fechaCreacion: "DESC" },
    });
  }
}

export const actividadesService = new ActividadesService();
