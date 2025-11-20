// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
// Si no usas jsonwebtoken, debes instalarlo: npm install jsonwebtoken
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig";
// Extender la interfaz Request de Express para incluir el objeto 'user'
interface CustomRequest extends Request {
    user?: { id: number; rol?: string; }; 
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no provisto." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
}