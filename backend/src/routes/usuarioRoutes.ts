// src/routes/usuarioRoutes.ts

import { Router } from 'express';
import { usuariosController } from '../controllers/usuariosController';
// Asume que tienes un middleware para validar DTOs (necesario para el DTO)
import { validateDtoMiddleware } from '../middlewares/validateDto'; 
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dtos/user.dtos'; 

const router = Router();

router.post('/signup', validateDtoMiddleware(CreateUserDto),usuariosController.registrar); // Valida DTO antes del Controller 
router.post('/login', validateDtoMiddleware(LoginUserDto), usuariosController.login);    // Valida DTO antes del Controller
router.get("/", usuariosController.listar);
router.get("/:id", usuariosController.obtenerPorId);
router.put("/:id",validateDtoMiddleware(UpdateUserDto),usuariosController.actualizar);
router.delete("/:id",usuariosController.eliminar);

export default router;