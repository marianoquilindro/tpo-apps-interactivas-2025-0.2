// src/dtos/create-comment.dto.ts

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
    // El ID de la tarea se obtiene del parámetro de la URL, no del cuerpo.
    
    @IsString()
    @IsNotEmpty({ message: 'El contenido del comentario es obligatorio.' })
    @MaxLength(1000)
    contenido!: string; 
}