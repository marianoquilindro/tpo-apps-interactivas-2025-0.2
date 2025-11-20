import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, // ¡Importante para las relaciones!
} from "typeorm";

// Importamos las entidades con las que se relaciona (las crearemos después)
import { Membresia } from "./Membresia";
import { Tarea } from "./Tarea";
import { Actividad } from './Actividad';
import { Notificacion } from './Notificacion';

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number; // Clave primaria

  @Column({ unique: true })
  email!: string; // Único, para login

  @Column()
  password!: string; // Se guardará hasheada (bcrypt)

  @Column()
  nombre!: string;

  @CreateDateColumn()
  fechaCreacion!: Date; // Fecha de creación automática

  @UpdateDateColumn()
  fechaActualizacion!: Date; // Fecha de última actualización automática // --- Relaciones Uno-a-Muchos (OneToMany) --- // 1. Relación con Membresias: Un usuario puede pertenecer a muchos equipos (a través de la tabla intermedia Membresia)

  @OneToMany(() => Membresia, (membresia) => membresia.usuario)
  membresias!: Membresia[]; // 2. Relación con Tareas Creadas: Un usuario puede crear muchas tareas

  //@OneToMany(() => Tarea, (tarea) => tarea.creadoPor)
  //tareasCreadas!: Tarea[]; // 3. Relación con Tareas Asignadas: Un usuario puede tener muchas tareas asignadas

  //@OneToMany(() => Tarea, (tarea) => tarea.asignadoA) // Usar el nombre exacto del campo en Tarea.ts
  //tareasAsignadas!: Tarea[];// Método para no exponer el password en las respuestas de la API (Seguridad)

  //@OneToMany(() => Actividad, actividad => actividad.usuario)
  //actividades!: Actividad[];

  @OneToMany(() => Notificacion, notificacion => notificacion.usuario)
    notificaciones!: Notificacion[];
  
  toJSON() {
    const { password, ...usuario } = this;
    return usuario;
  }
}
