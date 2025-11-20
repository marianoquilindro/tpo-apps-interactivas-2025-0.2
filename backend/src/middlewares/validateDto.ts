// src/middlewares/validateDto.ts

import { validate } from 'class-validator';
// CORRECCIÓN: Movemos ClassConstructor a class-transformer
import { plainToInstance, ClassConstructor } from 'class-transformer'; 
import { Request, Response, NextFunction } from 'express';

// Función de alto orden que acepta la clase DTO a validar
export function validateDtoMiddleware(dtoClass: ClassConstructor<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        
        // 1. Transformar el objeto plano (req.body) en una instancia de la clase DTO
        const dtoInstance = plainToInstance(dtoClass, req.body);
        
        // 2. Ejecutar la validación
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            // 3. Si hay errores, devolver una respuesta 400 Bad Request
            const errorMessages = errors.flatMap(err => 
                err.constraints ? Object.values(err.constraints) : []
            );
            
            return res.status(400).json({ 
                message: 'Error de validación de datos', 
                errors: errorMessages,
            });
        }
        
        // 4. Si es válido, continuar al siguiente middleware o controlador
        next();
    };
}