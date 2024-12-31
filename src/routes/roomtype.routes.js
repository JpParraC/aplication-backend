import express from 'express';
const router = express.Router();
import * as roomTypeController from '../controllers/roomtype.controllers.js';

// Rutas CRUD para los tipos de habitación
router.get('/', roomTypeController.getRoomTypes); // Obtener todos los tipos de habitación
router.get('/:id', roomTypeController.getRoomTypeById); // Obtener un tipo de habitación por ID
router.post('/', roomTypeController.createRoomType); // Crear un nuevo tipo de habitación
router.put('/:id', roomTypeController.updateRoomType); // Actualizar un tipo de habitación por ID
router.delete('/:id', roomTypeController.deleteRoomType); // Eliminar un tipo de habitación por ID

export default router;
