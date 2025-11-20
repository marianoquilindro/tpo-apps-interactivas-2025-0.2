// src/dtos/add-member.dto.ts

import { IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class AddMemberDto {
    @IsEmail({}, { message: 'Debe ser un correo electrónico válido para invitar.' })
    email!: string;

    @IsOptional()
    @IsIn(['Propietario', 'Miembro'], { message: 'El rol debe ser "Propietario" o "Miembro".' })
    rol?: 'Propietario' | 'Miembro';
}