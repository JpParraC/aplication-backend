import express from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/room.controllers.js';

const router = express.Router();

// Rutas para gestionar habitaciones
router.get('/', getRooms); // Obtener todas las habitaciones
router.get('/:id', getRoomById); // Obtener una habitación por ID
router.post('/', createRoom); // Crear una nueva habitación
router.put('/:id', updateRoom); // Actualizar una habitación
router.delete('/:id', deleteRoom); // Eliminar una habitación

export default router;
