// src/entities/Etiqueta.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
} from 'typeorm';

// Importamos Tarea para la relación ManyToMany (se completará en Tarea.ts)
import { Tarea } from './Tarea'; 

@Entity('etiquetas')
export class Etiqueta {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    nombre!: string; 
    
}