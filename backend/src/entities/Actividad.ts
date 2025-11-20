// src/entities/Actividad.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Tarea } from "./Tarea";
import { Usuario } from "./Usuario";

@Entity("actividades")
export class Actividad {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Tarea, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tareaId" })
  tarea!: Tarea;

  @Column()
  tareaId!: number;

  @ManyToOne(() => Usuario, { onDelete: "SET NULL" })
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;

  @Column()
  usuarioId!: number;

  // Tipo de actividad (por ejemplo: cambio de estado, comentario, asignación)
  @Column({ type: "varchar", length: 50 })
  tipo!: string;

  // Descripción del evento
  @Column("text")
  contenido!: string;

  // Fecha de registro automático
  @CreateDateColumn()
  fechaCreacion!: Date;
}
