import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Membresia } from './Membresia'; 
import { Tarea } from './Tarea';


@Entity('equipos')
export class Equipo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    nombre!: string;

    @CreateDateColumn()
    fechaCreacion!: Date;  

    // --- Relaciones ---

    // 1. Relación con Membresías (para saber quiénes y con qué rol pertenecen)
    @OneToMany(() => Membresia, membresia => membresia.equipo)
    membresias!: Membresia[];

    // 2. Relación con Tareas (las tareas que pertenecen a este equipo)
    /*@OneToMany(() => Tarea, tarea => tarea.equipo)
    tareas!: Tarea[];*/ 
}