import express from 'express';
import {
  getAdmins,
  addAdmin,
  getAdminByStaffId,
  editAdmin,
  removeAdmin
} from '../controllers/admin.controller.js';

const router = express.Router();

// Obtener todos los administradores
router.get('/', getAdmins);

// Crear un nuevo administrador
router.post('/', addAdmin);


// Obtener un administrador por `staff_id`
router.get('/:staffId', getAdminByStaffId);

// Actualizar un administrador
router.put('/:id', editAdmin);

// Eliminar un administrador
router.delete('/:id', removeAdmin);

export default router;
