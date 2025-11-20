// src/controllers/etiquetasController.ts

import { Request, Response, NextFunction } from 'express';
import { etiquetasService } from '../services/etiquetasService';
import { CreateLabelDto } from '../dtos/create-label.dto';

export class EtiquetasController {
    
    private handleServiceError(res: Response, error: unknown) {
        const customError = error as { status?: number; message?: string }; 
        const status = customError.status || 500;
        return res.status(status).json({ message: customError.message || 'Error interno del servidor.' });
    }

    /** POST /etiquetas - Crear una nueva etiqueta **/
    async crearEtiqueta(req: Request, res: Response, next: NextFunction) {
        try {
            // No necesitamos el ID de usuario aquí, ya que no son personales
            const labelDto: CreateLabelDto = req.body;
            const etiqueta = await etiquetasService.crearEtiqueta(labelDto);
            return res.status(201).json(etiqueta); 
        } catch (error) {
            return this.handleServiceError(res, error);
        }
    }
    
    /** GET /etiquetas - Obtener todas las etiquetas **/
    async obtenerEtiquetas(req: Request, res: Response, next: NextFunction) {
        try {
            const etiquetas = await etiquetasService.obtenerTodas();
            return res.status(200).json(etiquetas); 
        } catch (error) {
            return this.handleServiceError(res, error);
        }
    }
}

export const etiquetasController = new EtiquetasController();
