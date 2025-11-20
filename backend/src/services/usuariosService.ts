// src/services/usuariosService.ts
import { Repository } from "typeorm";
import { Like } from "typeorm";
import * as bcrypt from "bcrypt";
import { Usuario } from "../entities/Usuario";
import { CreateUserDto, LoginUserDto } from "../dtos/user.dtos";
import { AppDataSource } from "../data-source"; // Asume la configuración de tu conexión a DB

// Usamos una clase para encapsular los métodos de negocio
class UsuariosService {
  private repo: Repository<Usuario>;

  constructor() {
    // Inicializa el repositorio para interactuar con la tabla 'usuarios'
    this.repo = AppDataSource.getRepository(Usuario);
  }

  /** Lógica de Registro (Sign-up) **/
  async registrar(userData: CreateUserDto): Promise<Usuario> {
    // 1. Regla de Negocio: Verificar si el email ya está en uso
    const existingUser = await this.repo.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      // Lanza una excepción con código 400 que será capturada por el Controlador
      throw {
        status: 400,
        message: "El correo electrónico ya está registrado.",
      };
    }

    // 2. Seguridad: Hashear la contraseña (Lógica Crítica)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 3. Crear y guardar el nuevo usuario en la base de datos
    const nuevoUsuario = this.repo.create({
      nombre: userData.nombre,
      email: userData.email,
      password: hashedPassword,
    });

    return this.repo.save(nuevoUsuario);
  }

  /** Lógica de Validación de Credenciales (Login) **/
  async validarCredenciales(
    email: string,
    pass: string
  ): Promise<Usuario | null> {
    const user = await this.repo.findOne({ where: { email } });

    if (user && (await bcrypt.compare(pass, user.password))) {
      // Devuelve el objeto Usuario si las credenciales son válidas
      return user;
    }
    // Devuelve null si no se encuentra o la contraseña no coincide
    return null;
  }

  // Método auxiliar para buscar un usuario (útil para perfiles o JWT)
  async findById(id: number): Promise<Usuario | null> {
    return this.repo.findOne({ where: { id } });
  }

  //LISTAR LOS USUARIOS GUARDADOS O CREADOS
  async listar(filtros?: {
    nombre?: string;
    email?: string;
    orden?: "asc" | "desc";
  }): Promise<Usuario[]> {
    const where: any = {};

    if (filtros?.nombre) {
      // búsqueda insensible a mayúsculas/minúsculas
      where.nombre = Like(`%${filtros.nombre}%`);
    }

    if (filtros?.email) {
      where.email = Like(`%${filtros.email}%`);
    }

    const orden = filtros?.orden === "asc" ? "ASC" : "DESC";

    return await this.repo.find({
      where,
      order: { fechaCreacion: orden },
    });
  }

  async obtenerPorId(id: number): Promise<Usuario | null> {
    const usuario = await this.repo.findOne({
      where: { id },
      relations: ["membresias", "notificaciones"], // relaciones opcionales
    });

    return usuario || null;
  }

  async actualizar(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.repo.findOne({ where: { id } });

    if (!usuario) {
      throw { status: 404, message: `No se encontró el usuario con ID ${id}.` };
    }

    // Si se cambia el email, validar que no esté ya en uso
    if (data.email && data.email !== usuario.email) {
      const emailExistente = await this.repo.findOne({
        where: { email: data.email },
      });
      if (emailExistente) {
        throw {
          status: 400,
          message: "El correo electrónico ya está registrado.",
        };
      }
    }

    // Si se cambia la contraseña, encriptarla
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    // Actualizar campos
    Object.assign(usuario, data);

    const usuarioActualizado = await this.repo.save(usuario);
    return usuarioActualizado;
  }

  async eliminar(id: number): Promise<void> {
    // 1️⃣ Buscar el usuario por ID
    const usuario = await this.repo.findOne({
      where: { id },
      relations: ["membresias", "notificaciones"], // Cargamos relaciones relevantes
    });

    if (!usuario) {
      throw { status: 404, message: `No se encontró el usuario con ID ${id}.` };
    }

    // 2️⃣ Reglas de negocio: evitar borrar si tiene relaciones activas
    if (usuario.membresias && usuario.membresias.length > 0) {
      throw {
        status: 400,
        message: `No se puede eliminar el usuario con ID ${id} porque pertenece a uno o más equipos.`,
      };
    }

    // (Opcional) Si quisieras borrar en cascada notificaciones o actividades, lo harías aquí

    // 3️⃣ Eliminar el usuario
    await this.repo.remove(usuario);
  }
}

export const usuariosService = new UsuariosService();
