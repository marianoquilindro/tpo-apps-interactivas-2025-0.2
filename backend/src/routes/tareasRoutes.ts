// src/routes/tareaRoutes.ts

import { Router } from 'express';
import { tareasController } from '../controllers/tareasController';
import { validateDtoMiddleware } from '../middlewares/validateDto'; 
import { authMiddleware } from '../middlewares/authMiddleware'; 
import { CreateTaskDto } from '../dtos/create-task.dto'; 
import { UpdateTaskStatusDto } from '../dtos/update-task-status.dto'; 

const router = Router();

// Todas las rutas deben estar protegidas
router.use(authMiddleware); 

// POST /api/tareas - Crear Tarea
router.post(
    '/', 
    validateDtoMiddleware(CreateTaskDto),
    tareasController.crearTarea
); 

// GET /api/tareas/:id - Obtener Detalle
router.get(
    '/:id', 
    tareasController.obtenerTarea
);

// PATCH /api/tareas/:id/estado - Actualizar Estado
router.patch(
    '/:id/estado', 
    validateDtoMiddleware(UpdateTaskStatusDto), 
    tareasController.actualizarEstado
);

// GET /api/tareas - Listar todas las tareas del usuario
router.get('/', tareasController.listarTareas);

// DELETE /api/tareas/:id - Eliminar tarea
router.delete('/:id', tareasController.eliminarTarea);

export default router;