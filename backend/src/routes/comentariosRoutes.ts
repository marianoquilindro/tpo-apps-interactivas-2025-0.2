// src/routes/comentariosRoutes.ts

import { Router } from 'express';
import { comentariosController } from '../controllers/comentariosController';
import { validateDtoMiddleware } from '../middlewares/validateDto'; 
import { authMiddleware } from '../middlewares/authMiddleware'; 
import { CreateCommentDto } from '../dtos/create-comment.dto'; 

const router = Router();

// src/routes/comentariosRoutes.ts
router.use(authMiddleware);

// POST /api/tareas/:tareaId/comentarios
router.post('/:tareaId/comentarios', comentariosController.crearComentario);
// GET /api/tareas/:tareaId/comentarios
router.get('/:tareaId/comentarios', comentariosController.listarComentarios);

// DELETE /api/comentarios/:id
router.delete('/comentarios/:id', comentariosController.eliminarComentario);

export default router;