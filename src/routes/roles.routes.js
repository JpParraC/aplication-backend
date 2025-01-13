import express from 'express';
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} from '../controllers/roles.controllers.js';

const router = express.Router();

// Obtener todos los roles
router.get('/', getRoles);

// Obtener un rol específico por ID
router.get('/:id', getRoleById);

// Crear un nuevo rol
router.post('/', createRole);

// Actualizar un rol existente
router.put('/:id', updateRole);

// Eliminar un rol
router.delete('/:id', deleteRole);

export default router;

