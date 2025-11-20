import { IsIn } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsIn(['PENDIENTE', 'EN_CURSO', 'FINALIZADA', 'CANCELADA'], {
    message:
      'Estado inválido. Valores permitidos: PENDIENTE, EN_CURSO, FINALIZADA, CANCELADA.',
  })
  estado!: 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADA' | 'CANCELADA';
}