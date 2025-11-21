// src/services/tareasService.ts

import { Repository, In, Not } from "typeorm";
import { Tarea } from "../entities/Tarea";
import { Membresia } from "../entities/Membresia";
import { Etiqueta } from "../entities/Etiqueta";
import { Actividad } from "../entities/Actividad";
import { Usuario } from "../entities/Usuario";
import { CreateTaskDto } from "../dtos/create-task.dto";
import { AppDataSource } from "../data-source";
// Integración con otros servicios
import { notificacionesService } from "./notificacionesService";
import { equiposService } from "./equiposService";

// Inicialización de repositorios
const tareaRepo = AppDataSource.getRepository(Tarea);
const membresiaRepo = AppDataSource.getRepository(Membresia);
const etiquetaRepo = AppDataSource.getRepository(Etiqueta);
const actividadRepo = AppDataSource.getRepository(Actividad);
const usuarioRepo = AppDataSource.getRepository(Usuario);

class TareasService {
  // -------------------------------------------------------------------
  // --- LÓGICA AUXILIAR Y OBTENER ---
  // -------------------------------------------------------------------

  /**
   * Obtiene una tarea singular con sus relaciones.
   */
  async obtenerTarea(tareaId: number): Promise<Tarea> {
    const tarea = await tareaRepo.findOne({
      where: { id: tareaId } as any,
      // Aseguramos la carga de datos necesarios para la lógica
      relations: ["equipo", "creador", "asignadoA", "etiquetas"],
    });
    if (!tarea) {
      throw { status: 404, message: "Tarea no encontrada." };
    }
    return tarea;
  }

  // -------------------------------------------------------------------
  // --- 1. CREAR (C) ---
  // -------------------------------------------------------------------

  async crearTarea(taskDto: CreateTaskDto, creadorId: number): Promise<Tarea> {
    // 1. Autorización: Verificar si el creador es miembro del equipo
    const isMember = await membresiaRepo.findOne({
      where: { equipoId: taskDto.equipoId, usuarioId: creadorId },
    });
    if (!isMember) {
      throw {
        status: 403,
        message: "Acceso denegado. No pertenece al equipo.",
      };
    }

    // 2. Regla de Negocio: Prohibido fecha límite en el pasado
    if (
      taskDto.fechaLimite &&
      new Date(taskDto.fechaLimite).getTime() < Date.now()
    ) {
      throw {
        status: 400,
        message: "La fecha límite no puede ser en el pasado.",
      };
    }

    // 3. Obtener las etiquetas a relacionar
    let etiquetas: Etiqueta[] = [];
    if (taskDto.etiquetasIds && taskDto.etiquetasIds.length > 0) {
      etiquetas = await etiquetaRepo.findBy({ id: In(taskDto.etiquetasIds) });
    }

    // --- SOLUCIÓN DEL ERROR TS2304: Definir la variable aquí ---
    const nuevaTarea = tareaRepo.create({
      equipoId: taskDto.equipoId,
      titulo: taskDto.titulo,
      descripcion: taskDto.descripcion,
      prioridad: taskDto.prioridad,
      fechaLimite: taskDto.fechaLimite ? new Date(taskDto.fechaLimite) : null,
      asignadoAId: taskDto.asignadoAId,
      creadoPorId: creadorId,
      etiquetas: etiquetas,
    });

    const tareaGuardada: Tarea = await tareaRepo.save(nuevaTarea);

    // INTEGRACIÓN: Notificar Asignación (Requisito 8)
    if (tareaGuardada.asignadoAId && tareaGuardada.asignadoAId !== creadorId) {
      await notificacionesService.crearNotificacion(
        tareaGuardada.asignadoAId,
        "ASIGNACION",
        `Se te ha asignado la tarea "${tareaGuardada.titulo}" en el equipo ${taskDto.equipoId}.`,
        tareaGuardada.id
      );
    }
    return tareaGuardada;
  }

  // -------------------------------------------------------------------
  // --- 2. LEER (R) ---
  // -------------------------------------------------------------------

  async obtenerDetalle(tareaId: number, usuarioId: number): Promise<Tarea> {
    const tarea = await this.obtenerTarea(tareaId);

    // Autorización: El usuario debe ser miembro del equipo para ver la tarea
    await equiposService.verificarPermiso(
      usuarioId,
      tarea.equipoId!,
      "Miembro"
    );

    return tarea;
  }

  // -------------------------------------------------------------------
  // --- 3. ACTUALIZAR (U) - Cambio de Estado ---
  // -------------------------------------------------------------------

  async cambiarEstado(
  tareaId: number,
  nuevoEstado: string,
  usuarioId: number
): Promise<Tarea> {
  console.log("[service] cambiarEstado start", { tareaId, nuevoEstado, usuarioId });
  const tarea = await this.obtenerTarea(tareaId);
  console.log("[service] tarea encontrada antes cambio:", { id: tarea.id, estado: tarea.estado });

  // 1. Autorización: Debe ser Miembro del equipo
  await equiposService.verificarPermiso(
    usuarioId,
    tarea.equipoId!,
    "Miembro"
  );

  const estadoAnterior = tarea.estado;

  // 2. Regla de Negocio: Validar Transición
  if (estadoAnterior === "FINALIZADA" || estadoAnterior === "CANCELADA") {
    throw {
      status: 400,
      message: `No se puede cambiar el estado de una tarea ${estadoAnterior}.`,
    };
  }

  // ❌ Prohibir EN_CURSO → PENDIENTE
  if (estadoAnterior === "EN_CURSO" && nuevoEstado === "PENDIENTE") {
    throw {
      status: 400,
      message: "No se puede retroceder una tarea de EN_CURSO a PENDIENTE.",
    };
  }

  tarea.estado = nuevoEstado;
  console.log("[service] nuevo estado asignado:", tarea.estado);

  // 3. Registrar Actividad (Historial)
  await actividadRepo.save({
    tareaId: tarea.id,
    usuarioId: usuarioId,
    tipo: "CAMBIO_ESTADO",
    contenido: `Estado cambiado de "${estadoAnterior}" a "${nuevoEstado}".`,
  });

  // INTEGRACIÓN: Notificar al creador de la tarea
  if (tarea.creadoPorId !== usuarioId) {
    await notificacionesService.crearNotificacion(
      tarea.creadoPorId,
      "CAMBIO_ESTADO",
      `El estado de tu tarea "${tarea.titulo}" cambió a ${nuevoEstado}.`,
      tarea.id
    );
  }

  return tareaRepo.save(tarea);
}
  // -------------------------------------------------------------------
  // --- 4. ELIMINAR (D) ---
  // -------------------------------------------------------------------

  async eliminarTarea(
    tareaId: number,
    usuarioId: number
  ): Promise<{ message: string }> {
    const tarea = await this.obtenerTarea(tareaId);

    // Regla de Negocio: Eliminar solo el Propietario del equipo o el Creador (Requisito 6)

    // Opción A: Es el creador
    let tienePermiso = tarea.creadoPorId === usuarioId;

    // Opción B: Es el Propietario del equipo
    try {
      await equiposService.verificarPermiso(
        usuarioId,
        tarea.equipoId!,
        "Propietario"
      );
      tienePermiso = true;
    } catch (e) {
      // No es Propietario
    }

    if (!tienePermiso) {
      throw {
        status: 403,
        message:
          "Solo el creador o el Propietario del equipo pueden eliminar esta tarea.",
      };
    }

    const resultado = await tareaRepo.delete(tareaId);

    if (resultado.affected === 0) {
      throw { status: 404, message: "Tarea no encontrada." };
    }

    return { message: "Tarea eliminada exitosamente." };
  }

  async listarTareasPorUsuario(usuarioId: number): Promise<Tarea[]> {
    // 1. Buscar equipos donde el usuario es miembro
    const membresias = await membresiaRepo.find({ where: { usuarioId } });
    const equipoIds = membresias.map((m) => m.equipoId);

    if (equipoIds.length === 0) {
      return [];
    }

    // 2. Buscar tareas relacionadas con esos equipos o asignadas directamente al usuario
    return tareaRepo.find({
      where: [{ equipoId: In(equipoIds) }, { asignadoAId: usuarioId }],
      relations: ["equipo", "creador", "asignadoA", "etiquetas"],
    });
  }


}

export const tareasService = new TareasService();
