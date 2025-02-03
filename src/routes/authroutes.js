import express from 'express';
import { login, logout, requestPasswordReset, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', logout);

// Ruta para solicitar el código de restablecimiento de contraseña
router.post('/request-reset', requestPasswordReset);

// Ruta para restablecer la contraseña
router.post('/reset-password', resetPassword);

export default router;
