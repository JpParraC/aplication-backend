import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js'; // Importa el controlador

const router = express.Router();

// Ruta para obtener los datos del Dashboard
router.get('/', getDashboardData);

export default router;
