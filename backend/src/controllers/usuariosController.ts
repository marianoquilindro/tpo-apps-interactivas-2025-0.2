// src/controllers/usuariosController.ts

import { Request, Response, NextFunction } from "express";
import { usuariosService } from "../services/usuariosService";
import { CreateUserDto, LoginUserDto } from "../dtos/user.dtos";

import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwtConfig";

export class UsuariosController {
  /** POST /signup - Registro de un nuevo usuario **/
  // src/controllers/usuariosController.ts (Método registrar)
  
  async registrar(req: Request, res: Response) {
    try {
      console.log("📩 Datos recibidos:", req.body);

      const nuevoUsuario = await usuariosService.registrar(req.body);

      console.log("✅ Usuario creado:", nuevoUsuario);
      return res.status(201).json(nuevoUsuario.toJSON());
    } catch (error) {
      console.error("❌ Error en registrar usuario:", error);
      const status = (error as any).status || 500;
      const message =
        (error as any).message || "Error interno del servidor al registrar.";
      return res.status(status).json({ message });
    }
  }

  // ...

  /** POST /login - Inicio de sesión **/
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await usuariosService.validarCredenciales(email, password);

      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas." });
      }

      // 🔐 Generar token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return res.status(200).json({
        token,
        user: user.toJSON(),
        message: "Inicio de sesión exitoso",
      });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor." });
    }
  }
  async listar(req: Request, res: Response) {
    try {
      const { nombre, email, orden } = req.query;

      const usuarios = await usuariosService.listar({
        nombre: nombre as string,
        email: email as string,
        orden: orden as "asc" | "desc",
      });

      // Si no hay usuarios, devolvemos 204 (sin contenido)
      if (!usuarios.length) {
        return res.status(204).send();
      }

      return res.status(200).json(
        usuarios.map((u) => u.toJSON()) // Oculta password
      );
    } catch (error) {
      console.error("❌ Error al listar usuarios:", error);
      return res
        .status(500)
        .json({ message: "Error interno al listar usuarios." });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res
          .status(400)
          .json({ message: "El ID del usuario debe ser un número válido." });
      }

      const usuario = await usuariosService.obtenerPorId(id);

      if (!usuario) {
        return res
          .status(404)
          .json({ message: `No se encontró un usuario con ID ${id}.` });
      }

      // No exponemos contraseña (gracias al toJSON)
      return res.status(200).json(usuario.toJSON());
    } catch (error) {
      console.error("❌ Error al obtener usuario:", error);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
  }

  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "El ID debe ser numérico." });
      }

      const datosActualizacion = req.body;
      const usuarioActualizado = await usuariosService.actualizar(
        id,
        datosActualizacion
      );

      return res.status(200).json({
        message: "Usuario actualizado correctamente.",
        usuario: usuarioActualizado.toJSON(),
      });
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      const status = (error as any).status || 500;
      const message =
        (error as any).message || "Error interno al actualizar usuario.";
      return res.status(status).json({ message });
    }
  }

  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "El ID debe ser numérico." });
      }

      await usuariosService.eliminar(id);

      return res.status(200).json({
        message: `✅ Usuario con ID ${id} eliminado correctamente.`,
      });
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
      const status = (error as any).status || 500;
      const message =
        (error as any).message || "Error interno al eliminar usuario.";
      return res.status(status).json({ message });
    }
  }
}

export const usuariosController = new UsuariosController();
