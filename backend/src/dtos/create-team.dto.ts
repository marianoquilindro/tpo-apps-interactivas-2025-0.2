// src/dtos/create-team.dto.ts

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del equipo es obligatorio.' })
    @MinLength(3)
    @MaxLength(50)
    nombre!: string;

    // El ID del creador se obtiene del token JWT, NO se pasa en el body.
    // Solo se define aquí lo que el usuario envía.
}