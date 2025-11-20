// src/controllers/notificacionesController.ts

import { Request, Response, NextFunction } from "express";
import { MarkAsReadDto } from "../dtos/mark-as-read.dto";
import { notificacionesService } from "../services/notificacionesService";

export class NotificacionesController {
  private handleServiceError(res: Response, error: unknown) {
    const customError = error as { status?: number; message?: string };
    const status = customError.status || 500;
    return res
      .status(status)
      .json({ message: customError.message || "Error interno del servidor." });
  }

  /** GET /notificaciones - Obtener notificaciones del usuario (R) **/
  async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).user.id;
      // Query param ?leidas=true para ver todas, por defecto false
      const mostrarLeidas = req.query.leidas === "true";

      const notificaciones = await notificacionesService.obtenerNotificaciones(
        usuarioId,
        mostrarLeidas
      );

      return res.status(200).json(notificaciones.map((n) => n.toJSON()));
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  /** PATCH /notificaciones/read - Marcar como leídas (U) **/
  async marcarLeidas(req: Request, res: Response) {
    try {
      const usuarioId = (req as any).user.id;
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        throw {
          status: 400,
          message: "Debe enviar un arreglo con IDs válidos.",
        };
      }

      const result = await notificacionesService.marcarComoLeidas(
        usuarioId,
        ids
      );
      return res
        .status(200)
        .json({ message: `Se marcaron ${result.updated} notificaciones.` });
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }
}

export const notificacionesController = new NotificacionesController();
