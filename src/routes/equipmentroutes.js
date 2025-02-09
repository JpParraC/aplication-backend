import express from 'express';
const router = express.Router();
import * as equipmentController from '../controllers/equipment.controller.js';

// Rutas CRUD para los tipos de habitación
router.get('/', equipmentController.getRoomEquipments); // Obtener todos los tipos de habitación
router.get('/:id', equipmentController.getRoomEquipmentById); // Obtener un tipo de habitación por ID
router.post('/', equipmentController.createRoomEquipment); // Crear un nuevo tipo de habitación
router.put('/:id', equipmentController.updateRoomEquipment); // Actualizar un tipo de habitación por ID
router.delete('/:id', equipmentController.deleteRoomEquipment); // Eliminar un tipo de habitación por ID

export default router;
