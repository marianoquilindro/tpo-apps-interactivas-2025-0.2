// src/services/notificacionesService.ts

import { Repository, In } from "typeorm";
import { Notificacion, NotificacionTipo } from "../entities/Notificacion";
import { MarkAsReadDto } from "../dtos/mark-as-read.dto";
import { AppDataSource } from "../data-source";

const notificacionRepo = AppDataSource.getRepository(Notificacion);

class NotificacionesService {
  // -------------------------------------------------------------------
  // --- 1. CREAR (C) - Llamado por otros Servicios (p. ej., TareasService) ---
  // -------------------------------------------------------------------

  /**
   * Crea una notificación para un usuario específico.
   * @param usuarioId Receptor de la notificación.
   * @param tipo Tipo de evento (ASIGNACION, CAMBIO_ESTADO, etc.).
   * @param mensaje Contenido de la notificación.
   * @param referenciaId ID de la tarea/entidad que causó el evento.
   */
  async crearNotificacion(
    usuarioId: number,
    tipo: NotificacionTipo,
    mensaje: string,
    referenciaId?: number
  ): Promise<Notificacion> {
    const nuevaNotificacion = notificacionRepo.create({
      usuarioId,
      tipo,
      mensaje,
      referenciaId,
      leida: false,
    });

    return notificacionRepo.save(nuevaNotificacion);
  }

  // -------------------------------------------------------------------
  // --- 2. LEER (R) - Obtener Notificaciones Propias ---
  // -------------------------------------------------------------------

  /**
   * Obtiene todas las notificaciones pendientes (o todas) para un usuario.
   */
  async obtenerNotificaciones(
    usuarioId: number,
    mostrarLeidas: boolean
  ): Promise<Notificacion[]> {
    const where: any = { usuarioId };

    if (!mostrarLeidas) {
      where.leida = false;
    }

    return notificacionRepo.find({
      where: where,
      order: { fechaCreacion: "DESC" },
      take: 50, // Límite de notificaciones
    });
  }

  // -------------------------------------------------------------------
  // --- 3. ACTUALIZAR (U) - Marcar como Leídas ---
  // -------------------------------------------------------------------

  /**
   * Marca una o varias notificaciones como leídas.
   */
  async marcarComoLeidas(
    usuarioId: number,
    ids: number[]
  ): Promise<{ updated: number }> {
    if (!ids.length) return { updated: 0 };

    const result = await notificacionRepo.update(
      { id: In(ids), usuarioId },
      { leida: true }
    );
    return { updated: result.affected || 0 };
  }
}

export const notificacionesService = new NotificacionesService();
