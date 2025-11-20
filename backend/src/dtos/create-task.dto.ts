// src/dtos/create-task.dto.ts

import { IsNotEmpty, IsString, IsInt, IsOptional, IsIn, IsDateString, IsArray } from 'class-validator';

export class CreateTaskDto {
    @IsInt({ message: 'El ID del equipo es obligatorio y debe ser un número entero.' })
    equipoId!: number;

    @IsString()
    @IsNotEmpty({ message: 'El título de la tarea es obligatorio.' })
    titulo!: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsInt({ message: 'El ID asignado debe ser un número entero.' })
    asignadoAId?: number;

    @IsOptional()
    @IsIn(['Alta', 'Media', 'Baja'], { message: 'Prioridad inválida.' })
    prioridad?: 'Alta' | 'Media' | 'Baja';

    @IsOptional()
    @IsDateString({}, { message: 'La fecha límite debe ser una fecha válida.' })
    fechaLimite?: string; 
    
    @IsOptional()
    @IsArray({ message: 'Las etiquetas deben ser un array de IDs.' })
    @IsInt({ each: true, message: 'Cada etiqueta debe ser un ID numérico.' })
    etiquetasIds?: number[];
}