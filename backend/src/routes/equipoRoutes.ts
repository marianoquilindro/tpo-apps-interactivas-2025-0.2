import { Router } from 'express';
import { equiposController } from '../controllers/equiposController';
import { validateDtoMiddleware } from '../middlewares/validateDto';
import { authMiddleware } from '../middlewares/authMiddleware';
import { CreateTeamDto } from '../dtos/create-team.dto';
import { AddMemberDto } from '../dtos/add-member.dto';
import { RemoveMemberDto } from '../dtos/remove-member.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';

const router = Router();

router.use(authMiddleware);

// ✅ Enlazamos con .bind(equiposController)
router.post('/', validateDtoMiddleware(CreateTeamDto), equiposController.crearEquipo.bind(equiposController));

router.post('/:id/members', validateDtoMiddleware(AddMemberDto), equiposController.agregarMiembro.bind(equiposController));

router.delete('/:id/members', validateDtoMiddleware(RemoveMemberDto), equiposController.removerMiembro.bind(equiposController));

router.patch('/:id/role', validateDtoMiddleware(UpdateRoleDto), equiposController.actualizarRol.bind(equiposController));

router.get('/', equiposController.obtenerEquipos.bind(equiposController));

router.delete('/:id', equiposController.eliminarEquipo.bind(equiposController));


export default router;
