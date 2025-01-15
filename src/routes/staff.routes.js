// src/routes/staff.routes.js
import express from 'express';
import { getStaff, getStaffById, createStaff, updateStaff, deleteStaff } from '../controllers/staff.controller.js';

const router = express.Router();

// Definir las rutas para manejar el staff
router.get('/', getStaff);  // Obtener todos los empleados
router.get('/:id', getStaffById);  // Obtener un empleado por ID
router.post('/', createStaff);  // Crear un nuevo empleado
router.put('/:id', updateStaff);  // Actualizar un empleado por ID
router.delete('/:id', deleteStaff);  // Eliminar un empleado por ID

export default router;
