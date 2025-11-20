// src/controllers/membresiasController.ts
import { Request, Response, NextFunction } from 'express';
import { membresiasService } from '../services/membresiasService';
import { UpdateRoleDto } from '../dtos/update-role.dto';

export class MembresiasController {
    private handleError(res: Response, error: unknown) {
        const err = error as { status?: number; message?: string };
        return res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor.' });
    }

    /** PATCH /membresias/:equipoId/rol - Actualizar rol */
    async actualizarRol(req: Request, res: Response, next: NextFunction) {
        try {
            const equipoId = parseInt(req.params.equipoId);
            const editorId = (req as any).user.id;
            const dto: UpdateRoleDto = req.body;

            const result = await membresiasService.actualizarRol(equipoId, dto, editorId);
            return res.status(200).json(result);
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}

export const membresiasController = new MembresiasController();
