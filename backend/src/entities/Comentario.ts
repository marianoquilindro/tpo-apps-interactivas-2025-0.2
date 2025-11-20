import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Tarea } from "./Tarea";
import { Usuario } from "./Usuario";

@Entity("comentarios")
export class Comentario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  contenido!: string;

  // SOLUCIÓN FINAL DE SINTAXIS: Usamos el string literal sin función flecha,
  // lo que TypeORM requiere para la sintaxis simple.
  @ManyToOne("Tarea", { onDelete: "CASCADE" }) // <--- CORRECCIÓN DE SINTAXIS
  @JoinColumn({ name: "tareaId" })
  tarea!: Tarea;
  @Column()
  tareaId!: number;

  @ManyToOne(() => Usuario, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: "autorId" })
  autor!: Usuario;

  @Column()
  autorId!: number;

  @CreateDateColumn()
  fechaCreacion!: Date;

  // Método para devolver solo datos seguros (sin password del autor)
  toJSON() {
    return {
      id: this.id,
      contenido: this.contenido,
      tareaId: this.tareaId,
      autor: this.autor
        ? {
            id: this.autor.id,
            nombre: this.autor.nombre,
            email: this.autor.email,
          }
        : null,
      fechaCreacion: this.fechaCreacion,
    };
  }
}
