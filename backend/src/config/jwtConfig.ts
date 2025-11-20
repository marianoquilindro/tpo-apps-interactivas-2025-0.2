import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "clave_super_secreta";
export const JWT_EXPIRES_IN = "1d";
