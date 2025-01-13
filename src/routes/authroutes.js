// routes/authRoutes.js
import express from 'express';
import { login, updateAllUserPasswords } from '..//controllers/authController.js';

const router = express.Router();

// Ruta para login
router.post('/login', login);
router.post('/update-all-passwords', updateAllUserPasswords);

export default router;
