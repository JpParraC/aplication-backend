import express from 'express';
const router = express.Router();
import * as specificController from '../controllers/specific_equipment.controller.js';

// Rutas CRUD para los equipos específicos de habitación
router.get('/', specificController.getRoomSpecificEquipments); // Obtener todos los equipos
router.get('/:id', specificController.getRoomSpecificEquipmentById); // Obtener un equipo específico por ID
router.get('/room/:room_id', specificController.getEquipmentsByRoomId); // Obtener equipos de una habitación por room_id
router.get('/roomsall/room', specificController.getAllEquipmentGroupedByRoom);
router.post('/add-equipment/:room_id', specificController.createRoomSpecificEquipment); // Crear un nuevo equipo específico de habitación
router.put('/:id', specificController.updateRoomSpecificEquipment); // Actualizar un equipo específico de habitación
router.delete('/:id', specificController.deleteRoomSpecificEquipment); // Eliminar un equipo específico de habitación

export default router;
