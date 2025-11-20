// src/services/etiquetasService.ts

import { Repository } from 'typeorm';
import { Etiqueta } from '../entities/Etiqueta';
import { CreateLabelDto } from '../dtos/create-label.dto';
import { AppDataSource } from '../data-source'; 

const etiquetaRepo = AppDataSource.getRepository(Etiqueta);

class EtiquetasService {
    
    /**
     * Crea una nueva etiqueta (si no existe).
     */
    async crearEtiqueta(labelDto: CreateLabelDto): Promise<Etiqueta> {
        // Regla de Negocio: Chequear duplicado antes de intentar guardar
        const existingLabel = await etiquetaRepo.findOne({ where: { nombre: labelDto.nombre } });
        if (existingLabel) {
            // Si ya existe, podríamos devolver la existente o lanzar un error 400
            throw { status: 400, message: `La etiqueta "${labelDto.nombre}" ya existe.` };
        }

        const nuevaEtiqueta = etiquetaRepo.create(labelDto);
        return etiquetaRepo.save(nuevaEtiqueta);
    }
    
    /**
     * Obtiene todas las etiquetas (para listados/filtros).
     */
    async obtenerTodas(): Promise<Etiqueta[]> {
        return etiquetaRepo.find();
    }
    
    // Aquí iría el método para obtener por ID, si fuera necesario
}

export const etiquetasService = new EtiquetasService();