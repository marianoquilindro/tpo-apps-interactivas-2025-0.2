// src/routes/actividadesRoutes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { actividadesController } from "../controllers/actividadesController";

const router = Router();

router.use(authMiddleware);

// GET /api/tareas/:tareaId/actividad
router.get("/:tareaId/actividad", actividadesController.obtenerHistorial);

export default router;
