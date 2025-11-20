// src/dtos/create-label.dto.ts

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLabelDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la etiqueta es obligatorio.' })
    @MaxLength(50)
    nombre!: string; // Usamos '!'
}