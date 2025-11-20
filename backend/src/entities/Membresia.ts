// src/entities/Membresia.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique
} from 'typeorm';
import { Usuario } from './Usuario';
import { Equipo } from './Equipo';

@Unique(['usuarioId', 'equipoId']) 
@Entity('membresias')
export class Membresia {
    @PrimaryGeneratedColumn()
    id!: number;

    // Rol: Propietario o Miembro
    @Column({ 
        type: 'varchar', 
        //enum: ['Propietario', 'Miembro'],
        default: 'Miembro',
    })
    rol!: 'Propietario' | 'Miembro'; 

    // Clave Foránea a Usuario
    @ManyToOne(() => Usuario, usuario => usuario.membresias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuarioId' }) 
    usuario!: Usuario;

    @Column()
    usuarioId!: number; 

    // Clave Foránea a Equipo
    @ManyToOne(() => Equipo, equipo => equipo.membresias, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'equipoId' }) 
    equipo!: Equipo;
    
    @Column()
    equipoId!: number; 
}