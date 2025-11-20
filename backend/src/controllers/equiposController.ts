// src/controllers/equiposController.ts

import { Request, Response, NextFunction } from "express";
import { equiposService } from "../services/equiposService";
import { CreateTeamDto } from "../dtos/create-team.dto";
import { AddMemberDto } from "../dtos/add-member.dto";
import { RemoveMemberDto } from "../dtos/remove-member.dto";
import { UpdateRoleDto } from "../dtos/update-role.dto";
import { membresiasService } from "../services/membresiasService";

export class EquiposController {
  // -------------------------------------------------------------------
  // Método genérico para manejo de errores
  // -------------------------------------------------------------------
  private handleServiceError = (res: Response, error: unknown) => {
    const customError = error as { status?: number; message?: string };
    const status = customError.status || 500;
    return res
      .status(status)
      .json({ message: customError.message || "Error interno del servidor." });
  };

  // -------------------------------------------------------------------
  // POST /equipos - Crear un nuevo equipo
  // -------------------------------------------------------------------
  crearEquipo = async (req: Request, res: Response) => {
    try {
      const creadorId = (req as any).user.id;
      const teamDto: CreateTeamDto = req.body;

      const equipo = await equiposService.crearEquipo(teamDto, creadorId);
      return res.status(201).json(equipo);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  };

  // -------------------------------------------------------------------
  // DELETE /equipos/:id - Eliminar un equipo
  // -------------------------------------------------------------------
  async eliminarEquipo(req: Request, res: Response, next: NextFunction) {
    try {
      const equipoId = parseInt(req.params.id);
      const usuarioId = (req as any).user.id;

      await equiposService.verificarPermiso(usuarioId, equipoId, "Propietario");
      const resultado = await equiposService.eliminarEquipo(equipoId);
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  // -------------------------------------------------------------------
  // POST /equipos/:id/members - Añadir miembro
  // -------------------------------------------------------------------
  async agregarMiembro(req: Request, res: Response, next: NextFunction) {
    try {
      const equipoId = parseInt(req.params.id);
      const propietarioId = (req as any).user.id;
      const { email, rol = "Miembro" } = req.body as AddMemberDto;

      const nuevaMembresia = await equiposService.agregarMiembro(
        equipoId,
        email,
        rol,
        propietarioId
      );
      return res.status(201).json(nuevaMembresia);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  // -------------------------------------------------------------------
  // DELETE /equipos/:id/members - Remover miembro
  // -------------------------------------------------------------------
  async removerMiembro(req: Request, res: Response, next: NextFunction) {
    try {
      const equipoId = parseInt(req.params.id);
      const propietarioId = (req as any).user.id;
      const { email } = req.body as RemoveMemberDto;

      const resultado = await equiposService.removerMiembro(
        equipoId,
        email,
        propietarioId
      );
      return res.status(200).json(resultado);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  // -------------------------------------------------------------------
  // PATCH /equipos/:id/role - Actualizar rol de un miembro
  // -------------------------------------------------------------------
  async actualizarRol(req: Request, res: Response, next: NextFunction) {
    try {
      const equipoId = parseInt(req.params.id);
      const editorId = (req as any).user.id;
      const roleDto = req.body as UpdateRoleDto;

      const membresiaActualizada = await membresiasService.actualizarRol(
        equipoId,
        roleDto,
        editorId
      );

      return res.status(200).json(membresiaActualizada);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  // -------------------------------------------------------------------
  // GET /equipos - Listar todos los equipos del usuario autenticado
  // -------------------------------------------------------------------
  async obtenerEquipos(req: Request, res: Response) {
    try {
      const usuarioId = (req as any).user.id;
      const equipos = await equiposService.listarEquiposPorUsuario(usuarioId);
      return res.status(200).json(equipos);
    } catch (error) {
      console.error("❌ Error al listar equipos:", error);
      const status = (error as any).status || 500;
      return res
        .status(status)
        .json({ message: "Error interno al listar equipos." });
    }
  }

  // -------------------------------------------------------------------
  // GET /equipos/usuario - Listar equipos específicos del usuario
  // -------------------------------------------------------------------
  async listarEquiposPorUsuario(req: Request, res: Response) {
    try {
      const usuarioId = (req as any).user.id;
      const equipos = await equiposService.listarEquiposPorUsuario(usuarioId);
      return res.status(200).json(equipos);
    } catch (error) {
      console.error("❌ Error al listar equipos:", error);
      const status = (error as any).status || 500;
      return res
        .status(status)
        .json({ message: "Error interno al listar equipos." });
    }
  }

  // -------------------------------------------------------------------
  // GET /equipos/:id - Obtener equipo por ID
  // -------------------------------------------------------------------
  async obtenerEquipoPorId(req: Request, res: Response) {
    try {
      const equipoId = parseInt(req.params.id, 10);
      const usuarioId = (req as any).user.id;

      const equipo = await equiposService.obtenerEquipoPorId(
        equipoId,
        usuarioId
      );
      return res.status(200).json(equipo);
    } catch (error) {
      console.error("❌ Error al obtener equipo:", error);
      const status = (error as any).status || 500;
      const message =
        (error as any).message || "Error interno al obtener equipo.";
      return res.status(status).json({ message });
    }
  }
}

export const equiposController = new EquiposController();
