import { IsEmail } from 'class-validator';

export class RemoveMemberDto {
    @IsEmail({}, { message: 'Debe especificar el correo electrónico del miembro a remover.' })
    email!: string; // Añadimos '!'
}