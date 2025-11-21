// src/controllers/tareasController.ts

import { Request, Response, NextFunction } from "express";
import { tareasService } from "../services/tareasService";
import { CreateTaskDto } from "../dtos/create-task.dto";
import { UpdateTaskStatusDto } from "../dtos/update-task-status.dto";

export class TareasController {

  // Necesario para poder usar this.handleServiceError sin que se rompa
  constructor() {
    this.crearTarea = this.crearTarea.bind(this);
    this.obtenerTarea = this.obtenerTarea.bind(this);
    this.actualizarEstado = this.actualizarEstado.bind(this);
    this.eliminarTarea = this.eliminarTarea.bind(this);
    this.listarTareas = this.listarTareas.bind(this);
  }

  private handleServiceError(res: Response, error: unknown) {
    const customError = error as { status?: number; message?: string };
    const status = customError.status || 500;
    return res
      .status(status)
      .json({ message: customError.message || "Error interno del servidor." });
  }

  /** POST /tareas - Crear una nueva tarea **/
  async crearTarea(req: Request, res: Response, next: NextFunction) {
    try {
      const creadorId = (req as any).user.id;
      const taskDto: CreateTaskDto = req.body;

      const tarea = await tareasService.crearTarea(taskDto, creadorId);
      return res.status(201).json(tarea);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  /** GET /tareas/:id - Obtener detalle de tarea **/
  async obtenerTarea(req: Request, res: Response, next: NextFunction) {
    try {
      const tareaId = parseInt(req.params.id);
      // Aquí se haría una verificación de visibilidad (pertenece al equipo)

      const tarea = await tareasService.obtenerTarea(tareaId);
      return res.status(200).json(tarea);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  /** PATCH /tareas/:id/estado - Cambiar el estado de la tarea **/
  async actualizarEstado(req: Request, res: Response, next: NextFunction) {
    console.log("PATCH /api/tareas/:id/estado called", { 
      params: req.params, 
      body: req.body, 
      user: (req as any).user?.id 
    });

    try {
      const tareaId = parseInt(req.params.id);
      const usuarioId = (req as any).user.id;
      const { estado } = req.body as UpdateTaskStatusDto;

      const tarea = await tareasService.cambiarEstado(
        tareaId,
        estado,
        usuarioId
      );
      return res.status(200).json(tarea);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  /** DELETE /tareas/:id - Eliminar una tarea **/
  async eliminarTarea(req: Request, res: Response, next: NextFunction) {
    try {
      const tareaId = parseInt(req.params.id);
      const usuarioId = (req as any).user.id;

      const result = await tareasService.eliminarTarea(tareaId, usuarioId);
      return res.status(200).json(result);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  /** GET /tareas - Listar tareas del usuario **/
  async listarTareas(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).user.id;
      const tareas = await tareasService.listarTareasPorUsuario(usuarioId);
      return res.status(200).json(tareas);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }
}

export const tareasController = new TareasController();
