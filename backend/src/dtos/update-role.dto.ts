// src/dtos/update-role.dto.ts
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsEmail({}, { message: 'Debe especificar un correo válido.' })
  email!: string;

  @IsNotEmpty({ message: 'El rol no puede estar vacío.' })
  @IsIn(['Propietario', 'Miembro'], { message: 'El rol debe ser Propietario o Miembro.' })
  rol!: 'Propietario' | 'Miembro';
}
