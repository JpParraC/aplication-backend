// routes/protectedRoutes.js
import express from 'express';
import { authenticateAndAuthorize } from '../middleware/authmiddleware.js';

const router = express.Router();

// Ruta protegida para el dashboard
router.get('/dashboard', authenticateAndAuthorize('view_dashboard'), (req, res) => {
  res.json({
    message: 'Bienvenido al dashboard',
    user: req.user,  // Información del usuario extraída del token
  });
});

// Ruta protegida para los clientes
router.get('/clients', authenticateAndAuthorize('manage_clients'), (req, res) => {
  res.json({
    message: 'Accediendo a los clientes',
    user: req.user,
  });
});

// Ruta protegida para la gestión de reservas
router.get('/reservation', authenticateAndAuthorize('manage_reservations'), (req, res) => {
  res.json({
    message: 'Accediendo a las reservas',
    user: req.user,
  });
});

// Ruta protegida para administrar administradores
router.get('/adm', authenticateAndAuthorize('manage_admins'), (req, res) => {
  res.json({
    message: 'Accediendo a los administradores',
    user: req.user,
  });
});

// Ruta protegida para las habitaciones
router.get('/room', authenticateAndAuthorize('view_rooms'), (req, res) => {
  res.json({
    message: 'Accediendo a las habitaciones',
    user: req.user,
  });
});

// Ruta protegida para el personal
router.get('/staff', authenticateAndAuthorize('view_staff'), (req, res) => {
  res.json({
    message: 'Accediendo al personal',
    user: req.user,
  });
});

// Ruta protegida para las tareas
router.get('/task', authenticateAndAuthorize('manage_tasks'), (req, res) => {
  res.json({
    message: 'Accediendo a las tareas',
    user: req.user,
  });
});

// Ruta protegida para las facturas
router.get('/invoice', authenticateAndAuthorize('view_invoice'), (req, res) => {
  res.json({
    message: 'Accediendo a las facturas',
    user: req.user,
  });
});

// Ruta protegida para el calendario
router.get('/calendar', authenticateAndAuthorize('view_calendar'), (req, res) => {
  res.json({
    message: 'Accediendo al calendario',
    user: req.user,
  });
});

export default router;
