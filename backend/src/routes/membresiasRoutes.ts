// src/routes/membresiasRoutes.ts
import { Router } from 'express';
import { membresiasController } from '../controllers/membresiasController';
import { validateDtoMiddleware } from '../middlewares/validateDto';
import { authMiddleware } from '../middlewares/authMiddleware';
import { UpdateRoleDto } from '../dtos/update-role.dto';

const router = Router();

router.use(authMiddleware);

// PATCH /api/membresias/:equipoId/rol
router.patch('/:equipoId/rol', validateDtoMiddleware(UpdateRoleDto), membresiasController.actualizarRol);

export default router;
