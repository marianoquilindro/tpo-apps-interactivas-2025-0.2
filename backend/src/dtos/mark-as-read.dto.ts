// src/dtos/mark-as-read.dto.ts
import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class MarkAsReadDto {
  @IsArray({ message: 'Debe enviar un arreglo de IDs.' })
  @ArrayNotEmpty({ message: 'Debe incluir al menos un ID.' })
  @IsInt({ each: true, message: 'Cada ID debe ser un número entero.' })
  ids!: number[];
}