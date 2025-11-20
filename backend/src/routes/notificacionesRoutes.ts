import { Router } from 'express';
import { notificacionesController } from '../controllers/notificacionesController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateDtoMiddleware } from '../middlewares/validateDto';
import { MarkAsReadDto } from '../dtos/mark-as-read.dto';

const router = Router();

router.use(authMiddleware);

// GET /api/notificaciones
router.get('/', notificacionesController.obtener);

// PATCH /api/notificaciones/read
router.patch(
  '/read',
  validateDtoMiddleware(MarkAsReadDto),
  notificacionesController.marcarLeidas
);

export default router;
