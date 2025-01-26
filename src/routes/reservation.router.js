import express from 'express';
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
} from '../controllers/reservation.controllers.js';

const router = express.Router();

// Obtener todas las reservas
router.get('/', getReservations);

// Obtener una reserva por ID
router.get('/:id', getReservationById);

// Crear una nueva reserva
router.post('/', createReservation);

// Actualizar una reserva existente
router.put('/:id', updateReservation);

// Eliminar una reserva
router.delete('/:id', deleteReservation);

export default router;
