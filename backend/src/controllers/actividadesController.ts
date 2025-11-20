// src/controllers/actividadesController.ts
import { Request, Response } from "express";
import { actividadesService } from "../services/actividadesService";

class ActividadesController {
  private handleServiceError(res: Response, error: unknown) {
    const e = error as { status?: number; message?: string };
    return res.status(e.status || 500).json({
      message: e.message || "Error interno del servidor",
    });
  }

  async obtenerHistorial(req: Request, res: Response) {
    try {
      const tareaId = parseInt(req.params.tareaId);
      const usuarioId = (req as any).user.id;
      const historial = await actividadesService.obtenerHistorialPorTarea(
        tareaId,
        usuarioId
      );
      res.status(200).json(historial);
    } catch (error) {
      this.handleServiceError(res, error);
    }
  }
}

export const actividadesController = new ActividadesController();
