// src/entities/Tarea.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Equipo } from "./Equipo";
import { Etiqueta } from "./Etiqueta";
import { Actividad } from "./Actividad";
import { Comentario } from "./Comentario";

@Entity("tareas") // ¡CRÍTICO! Faltaba el decorador @Entity
export class Tarea {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column("text")
  descripcion!: string;

  @Column({
    type: "varchar",
    enum: ["PENDIENTE", "EN_CURSO", "FINALIZADA", "CANCELADA"],
    default: "PENDIENTE",
  })
  estado!: string;

  @Column({
    type: "varchar",
    enum: ["Alta", "Media", "Baja"],
    default: "Media",
  })
  prioridad!: "Alta" | "Media" | "Baja";

  @Column({ type: "datetime", nullable: true })
  fechaLimite?: Date | null; // Corregido: Permite Date o null // --- RELACIONES MANY-TO-ONE (Foreign Keys) --- // Creador de la Tarea (Unidireccional: solo la FK)

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "creadoPorId" })
  creador!: Usuario;
  @Column()
  creadoPorId!: number; // Columna física // Asignado a (Unidireccional y opcional)

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: "asignadoAId" })
  asignadoA?: Usuario;
  @Column({ nullable: true })
  asignadoAId?: number; // Equipo (Unidireccional)

  @ManyToOne(() => Equipo)
  @JoinColumn({ name: "equipoId" })
  equipo!: Equipo;
  @Column()
  equipoId!: number; // --- RELACIONES MANY-TO-MANY ---

  @ManyToMany("Etiqueta") // <--- USAR STRING LITERAL para resolver la carga
  @JoinTable({
    name: "tarea_etiquetas",
    joinColumn: { name: "tareaId" },
    inverseJoinColumn: { name: "etiquetaId" },
  })
  etiquetas!: Etiqueta[]; // --- PROPIEDADES INVERSAS (DEBEN SER EL LADO ONE DE UN ONE-TO-MANY) --- // El historial y comentarios deben estar definidos aquí para que el ORM lo sepa, // pero para evitar el error de carga, deben ser propiedades válidas si se usara el decorador @OneToMany. // NOTA: Quitamos el decorador @OneToMany para evitar el error de metadata persistente // Esta propiedad era un error de sintaxis ("istorial") // La dejamos tipada para el contexto del negocio, pero sin decorador OneToMany // istorial!: Actividad[]; // Comentarios (Propiedad solo para contexto, si eliminas el OneToMany) // comentarios!: Comentario[];

  @CreateDateColumn()
  fechaCreacion!: Date;

  @UpdateDateColumn()
  fechaActualizacion!: Date;
}
