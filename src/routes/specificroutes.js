import express from 'express';
const router = express.Router();
import * as specificController from '../controllers/specific_equipment.controller.js';

// Rutas CRUD para los tipos de habitación
router.get('/', specificController.getRoomSpecificEquipments);
router.get('/:id', specificController.getRoomSpecificEquipmentById); 
router.post('/', specificController.createRoomSpecificEquipment); 
router.put('/:id', specificController.updateRoomSpecificEquipment); 
router.delete('/:id', specificController.deleteRoomSpecificEquipment); 

export default router;
