// src/services/comentariosService.ts - VERSIÓN FINAL Y ESTRUCTURALMENTE CORRECTA

import { Repository } from 'typeorm';
import { Comentario } from '../entities/Comentario';
import { Tarea } from '../entities/Tarea';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { AppDataSource } from '../data-source'; 
import { equiposService } from './equiposService'; // Para verificación de membresía

const comentarioRepo = AppDataSource.getRepository(Comentario);
const tareaRepo = AppDataSource.getRepository(Tarea);

class ComentariosService {

    private async verificarAccesoATarea(tareaId: number, usuarioId: number): Promise<Tarea> {
        const tarea = await tareaRepo.findOne({
            where: { id: tareaId } as any,
            select: ['id', 'equipoId']
        });

        if (!tarea) throw { status: 404, message: 'Tarea no encontrada.' };

        await equiposService.verificarPermiso(usuarioId, tarea.equipoId!, 'Miembro');
        return tarea;
    }

    // ✅ CREAR
    async crearComentario(tareaId: number, autorId: number, commentDto: CreateCommentDto): Promise<Comentario> {
        await this.verificarAccesoATarea(tareaId, autorId);
        const nuevoComentario = comentarioRepo.create({
            contenido: commentDto.contenido,
            tareaId,
            autorId,
        });

        const guardado = await comentarioRepo.save(nuevoComentario);
        return (await comentarioRepo.findOne({ where: { id: guardado.id } }))!;
    }

    // ✅ LISTAR
    async listarPorTarea(tareaId: number, usuarioId: number): Promise<Comentario[]> {
        await this.verificarAccesoATarea(tareaId, usuarioId);
        return comentarioRepo.find({
            where: { tareaId },
            order: { fechaCreacion: 'ASC' },
        });
    }

    // ✅ ELIMINAR
    async eliminarComentario(comentarioId: number, usuarioId: number): Promise<{ message: string }> {
        const comentario = await comentarioRepo.findOne({ where: { id: comentarioId } });
        if (!comentario) throw { status: 404, message: 'Comentario no encontrado.' };

        // Obtener tarea para verificar permisos
        const tarea = await tareaRepo.findOne({ where: { id: comentario.tareaId }, select: ['equipoId'] });
        if (!tarea) throw { status: 404, message: 'Tarea asociada no encontrada.' };

        // Solo puede eliminarlo el autor o un Propietario del equipo
        let tienePermiso = comentario.autorId === usuarioId;
        if (!tienePermiso) {
            try {
                await equiposService.verificarPermiso(usuarioId, tarea.equipoId!, 'Propietario');
                tienePermiso = true;
            } catch (e) {}
        }

        if (!tienePermiso) {
            throw { status: 403, message: 'No tiene permiso para eliminar este comentario.' };
        }

        await comentarioRepo.delete(comentarioId);
        return { message: 'Comentario eliminado correctamente.' };
    }
}

export const comentariosService = new ComentariosService();