// src/entities/Notificacion.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn
} from 'typeorm';
import { Usuario } from './Usuario';

// Tipos de eventos basados en los requisitos (Requisito 8)
export type NotificacionTipo = 'ASIGNACION' | 'CAMBIO_ESTADO' | 'COMENTARIO' | 'INVITACION';

@Entity('notificaciones')
export class Notificacion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' , length:255})
    mensaje!: string; // Mensaje corto para mostrar al usuario

    @Column({ type: 'varchar', enum: ['ASIGNACION', 'CAMBIO_ESTADO', 'COMENTARIO', 'INVITACION'] })
    tipo!: NotificacionTipo;

    @Column({ default: false })
    leida!: boolean; // Si el usuario ya vio la notificación

    @Column({ nullable: true })
    referenciaId?: number; // ID de la entidad relacionada (Tarea o Membresia)

    @CreateDateColumn()
    fechaCreacion!: Date;

    // --- Relación con Usuario (Receptor) ---
    @ManyToOne(() => Usuario, usuario => usuario.notificaciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuarioId' })
    usuario!: Usuario;

    @Column()
    usuarioId!: number;
    
    // Método para devolver datos limpios
    toJSON() {
        // No necesitamos exponer relaciones grandes
        const { usuario, ...notificacion } = this;
        return notificacion;
    }
}