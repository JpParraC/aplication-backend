import express from 'express';
import {
  getAdmins,
  addAdmin,
  getAdminByStaffId,
  editAdmin,
  removeAdmin,
  getAllUsersWithDetails, updateAdmin
} from '../controllers/admin.controller.js';

const router = express.Router();


router.get('/all-users', getAllUsersWithDetails); // Obtener todos los usuarios con detalles

// Rutas generales después
router.get('/', getAdmins); // Obtener todos los administradores
router.post('/', addAdmin); // Crear un nuevo administrador
router.get('/:staffId', getAdminByStaffId); // Obtener un administrador por `staff_id`
router.put('/:id_staff', updateAdmin); // Actualizar un administrador por `id`
router.delete('/:staff_id', removeAdmin); // Eliminar un administrador

export default router;
