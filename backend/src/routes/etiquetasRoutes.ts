// src/routes/etiquetasRoutes.ts

import { Router } from 'express';
import { etiquetasController } from "../controllers/etiquetasController"; // Importa la instancia 'etiquetasController'
import { validateDtoMiddleware } from '../middlewares/validateDto'; 
import { authMiddleware } from '../middlewares/authMiddleware'; 
import { CreateLabelDto } from '../dtos/create-label.dto'; 

const router = Router();

router.use(authMiddleware); 

// POST /api/etiquetas - Crear etiqueta
router.post(
    '/', 
    validateDtoMiddleware(CreateLabelDto),
    // Usar el método del objeto importado:
    etiquetasController.crearEtiqueta 
); 

// GET /api/etiquetas - Listar todas
router.get(
    '/', 
    // Usar el método del objeto importado:
    etiquetasController.obtenerEtiquetas // Nota: En el código que mostré, la función es 'obtenerEtiquetas'
);

export default router;