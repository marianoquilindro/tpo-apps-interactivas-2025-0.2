// src/services/equiposService.ts

import { Repository, Not, In } from "typeorm";
import { Equipo } from "../entities/Equipo";
import { Membresia } from "../entities/Membresia";
import { Usuario } from "../entities/Usuario";
import { Tarea } from "../entities/Tarea";
import { CreateTeamDto } from "../dtos/create-team.dto";
import { AppDataSource } from "../data-source";
// --- INTEGRACIÓN: Notificaciones y otros servicios ---
import { notificacionesService } from "./notificacionesService";
// Asumimos que TareaService es un servicio externo si fuera necesario:
// import { tareasService } from './tareasService';

// Inicialización de repositorios
const equipoRepo = AppDataSource.getRepository(Equipo);
const membresiaRepo = AppDataSource.getRepository(Membresia);
const usuarioRepo = AppDataSource.getRepository(Usuario);
const tareaRepo = AppDataSource.getRepository(Tarea);

class EquiposService {
  /**
   * Crea un equipo y asigna al creador como Propietario.
   */
  async crearEquipo(dto: CreateTeamDto, usuarioId: number): Promise<Equipo> {
    try {
      const equipoExistente = await equipoRepo.findOne({
        where: { nombre: dto.nombre },
      });
      if (equipoExistente) {
        throw {
          status: 400,
          message: `Ya existe un equipo con el nombre "${dto.nombre}".`,
        };
      }

      const equipo = equipoRepo.create(dto);
      const equipoGuardado = await equipoRepo.save(equipo);

      // Crear membresía del propietario
      const membresia = membresiaRepo.create({
        usuarioId,
        equipoId: equipoGuardado.id,
        rol: "Propietario",
      });
      await membresiaRepo.save(membresia);

      return equipoGuardado;
    } catch (error: any) {
      if (error.code === "SQLITE_CONSTRAINT" || /UNIQUE/i.test(error.message)) {
        throw {
          status: 400,
          message: `Ya existe un equipo con el nombre "${dto.nombre}".`,
        };
      }
      throw error;
    }
  }

  /**
   * Valida si un usuario tiene un rol específico en un equipo.
   */
  async verificarPermiso(
    usuarioId: number,
    equipoId: number,
    rolRequerido: "Propietario" | "Miembro"
  ): Promise<Membresia> {
    const membresia = await membresiaRepo.findOne({
      where: { usuarioId, equipoId },
    });

    if (!membresia) {
      throw {
        status: 403,
        message: "Acceso denegado. No pertenece al equipo.",
      };
    }

    if (rolRequerido === "Propietario" && membresia.rol !== "Propietario") {
      throw {
        status: 403,
        message: "Acceso denegado. Se requiere rol de Propietario.",
      };
    }

    return membresia;
  }

  /**
   * Elimina un equipo. Regla de negocio: No eliminar si tiene tareas activas.
   */
  async eliminarEquipo(equipoId: number) {
    // --- CORRECCIÓN CRÍTICA DE TYPEORM (Evitar metadata fallida) ---
    // Buscamos directamente la columna 'equipoId' en Tarea (FK física)
    // para evitar que TypeORM intente cargar la compleja relación bidireccional de 'equipo'.
    const tareasActivas = await tareaRepo.count({
      where: {
        equipoId: equipoId as any, // Usamos la columna FK directamente
        estado: In(["PENDIENTE", "EN_CURSO"]), // Usamos la capitalización correcta
      } as any,
    });

    if (tareasActivas > 0) {
      throw {
        status: 400,
        message:
          "No se puede eliminar el equipo: tiene tareas Pendientes o En curso.",
      };
    }

    const resultado = await equipoRepo.delete(equipoId);

    if (resultado.affected === 0) {
      throw { status: 404, message: "Equipo no encontrado." };
    }

    return { message: "Equipo eliminado exitosamente." };
  }

  /**
   * Añade un usuario (por email) a un equipo.
   */
  async agregarMiembro(
    equipoId: number,
    email: string,
    rol: "Propietario" | "Miembro",
    propietarioId: number
  ) {
    await this.verificarPermiso(propietarioId, equipoId, "Propietario");

    const usuarioAAgregar = await usuarioRepo.findOne({ where: { email } });
    if (!usuarioAAgregar) {
      throw { status: 404, message: "Usuario a agregar no encontrado." };
    }

    const membresiaExistente = await membresiaRepo.findOne({
      where: { equipoId, usuarioId: usuarioAAgregar.id },
    });

    if (!["Propietario", "Miembro"].includes(rol)) {
      throw {
        status: 400,
        message: "Rol inválido. Valores permitidos: Propietario o Miembro.",
      };
    }

    const nuevaMembresia = membresiaRepo.create({
      equipoId,
      usuarioId: usuarioAAgregar.id,
      rol,
    });

    const membresiaGuardada = await membresiaRepo.save(nuevaMembresia);

    // --- INTEGRACIÓN: DISPARAR NOTIFICACIÓN ---
    const equipo = await equipoRepo.findOneBy({ id: equipoId });
    await notificacionesService.crearNotificacion(
      usuarioAAgregar.id,
      "INVITACION",
      `Has sido añadido como ${rol} al equipo "${equipo?.nombre}".`,
      equipoId
    );

    return membresiaGuardada;
  }

  /**
   * Remueve un miembro de un equipo.
   */
  async removerMiembro(
    equipoId: number,
    emailARemover: string,
    propietarioId: number
  ) {
    await this.verificarPermiso(propietarioId, equipoId, "Propietario");

    const usuarioARemover = await usuarioRepo.findOne({
      where: { email: emailARemover },
    });
    if (!usuarioARemover) {
      throw { status: 404, message: "Miembro a remover no encontrado." };
    }

    // Regla de Negocio: No puede remover al único propietario
    const membresia = await membresiaRepo.findOne({
      where: { equipoId, usuarioId: usuarioARemover.id, rol: "Propietario" },
    });

    if (membresia) {
      const propietariosRestantes = await membresiaRepo.count({
        where: {
          equipoId,
          rol: "Propietario",
          usuarioId: Not(usuarioARemover.id),
        },
      });

      if (propietariosRestantes === 0) {
        throw {
          status: 400,
          message: "No se puede remover al único propietario del equipo.",
        };
      }
    }

    const resultado = await membresiaRepo.delete({
      equipoId,
      usuarioId: usuarioARemover.id,
    });

    if (resultado.affected === 0) {
      throw {
        status: 404,
        message: "El usuario no era miembro de este equipo.",
      };
    }

    return { message: "Miembro removido exitosamente." };
  }

  // src/services/equiposService.ts

  async listarEquiposPorUsuario(usuarioId: number): Promise<Equipo[]> {
    const membresias = await membresiaRepo.find({
      where: { usuarioId },
      relations: ["equipo", "equipo.membresias", "equipo.membresias.usuario"],
    });
    return membresias.map((m) => m.equipo);
  }

  async obtenerEquipoPorId(
    equipoId: number,
    usuarioId: number
  ): Promise<Equipo> {
    // Verifica que el usuario tenga acceso al equipo
    const membresia = await membresiaRepo.findOne({
      where: { equipoId, usuarioId },
    });

    if (!membresia) {
      throw { status: 403, message: "Acceso denegado al equipo solicitado." };
    }

    // Cargamos el equipo con sus relaciones principales
    const equipo = await equipoRepo.findOne({
      where: { id: equipoId },
      relations: ["membresias", "membresias.usuario", "tareas"],
    });

    if (!equipo) {
      throw { status: 404, message: "Equipo no encontrado." };
    }

    return equipo;
  }
}

export const equiposService = new EquiposService();
