import { Request, Response } from 'express';
import { comentariosService } from '../services/comentariosService';
import { CreateCommentDto } from '../dtos/create-comment.dto';

export class ComentariosController {
    private handleServiceError(res: Response, error: unknown) {
        const err = error as { status?: number; message?: string };
        return res.status(err.status || 500).json({
            message: err.message || 'Error interno del servidor.',
        });
    }

    async crearComentario(req: Request, res: Response) {
        try {
            const tareaId = parseInt(req.params.tareaId);
            const autorId = (req as any).user.id;
            const dto: CreateCommentDto = req.body;
            const comentario = await comentariosService.crearComentario(
                tareaId,
                autorId,
                dto
            );
            res.status(201).json(comentario);
        } catch (e) {
            this.handleServiceError(res, e);
        }
    }

    async listarComentarios(req: Request, res: Response) {
        try {
            const tareaId = parseInt(req.params.tareaId);
            const usuarioId = (req as any).user.id;
            const comentarios = await comentariosService.listarPorTarea(
                tareaId,
                usuarioId
            );
            res.status(200).json(comentarios);
        } catch (e) {
            this.handleServiceError(res, e);
        }
    }

    async eliminarComentario(req: Request, res: Response) {
        try {
            const comentarioId = parseInt(req.params.id);
            const usuarioId = (req as any).user.id;
            const result = await comentariosService.eliminarComentario(
                comentarioId,
                usuarioId
            );
            res.status(200).json(result);
        } catch (e) {
            this.handleServiceError(res, e);
        }
    }
}

export const comentariosController = new ComentariosController();
