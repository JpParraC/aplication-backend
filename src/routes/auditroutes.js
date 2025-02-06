import express from 'express';
import { getAuditData } from '../controllers/audit.controller.js'; // Importa el controlador

const router = express.Router();

// Ruta para obtener los registros de auditoría
router.get('/', getAuditData);

export default router;
