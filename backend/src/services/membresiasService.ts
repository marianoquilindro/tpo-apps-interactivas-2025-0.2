// src/services/membresiasService.ts

import { Repository, Not } from 'typeorm';
import { Membresia } from '../entities/Membresia';
import { Usuario } from '../entities/Usuario';
import { AppDataSource } from '../data-source'; 
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { equiposService } from './equiposService'; // Para reusar la verificación de Propietario

const membresiaRepo = AppDataSource.getRepository(Membresia);
const usuarioRepo = AppDataSource.getRepository(Usuario);

class MembresiasService {

    /**
     * Cambia el rol de un miembro existente en un equipo.
     * @param equipoId ID del equipo.
     * @param roleDto Objeto con email y nuevo rol.
     * @param editorId ID del Propietario que realiza el cambio.
     */
    async actualizarRol(equipoId: number, roleDto: UpdateRoleDto, editorId: number): Promise<Membresia> {
        // 1. Autorización: Debe ser Propietario para cambiar roles
        await equiposService.verificarPermiso(editorId, equipoId, 'Propietario');
        
        // 2. Encontrar el usuario objetivo
        const usuarioObjetivo = await usuarioRepo.findOne({ where: { email: roleDto.email } });
        if (!usuarioObjetivo) {
            throw { status: 404, message: 'Usuario objetivo no encontrado.' };
        }

        // 3. Encontrar la membresía
        const membresia = await membresiaRepo.findOne({
            where: { equipoId, usuarioId: usuarioObjetivo.id },
        });
        if (!membresia) {
            throw { status: 404, message: 'El usuario no es miembro de este equipo.' };
        }
        
        // 4. Regla de Negocio: No puede quitarle el rol de Propietario al único Propietario (si el rol anterior era Propietario y el nuevo es Miembro)
        if (membresia.rol === 'Propietario' && roleDto.rol === 'Miembro') {
            const propietariosRestantes = await membresiaRepo.count({
                where: { equipoId, rol: 'Propietario', usuarioId: Not(usuarioObjetivo.id) }
            });

            if (propietariosRestantes === 0) {
                throw { status: 400, message: 'Debe haber al menos un Propietario en el equipo.' };
            }
        }
        
        // 5. Aplicar el nuevo rol y guardar
        membresia.rol = roleDto.rol;
        return membresiaRepo.save(membresia);
    }
}

export const membresiasService = new MembresiasService();