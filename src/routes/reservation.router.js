// src/routes/reservation.router.js

import express from 'express';
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,

} from '../controllers/reservation.controllers.js';

const router = express.Router();

router.get('/', getReservations);
router.get('/:id', getReservationById);
router.post('/', createReservation);
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);


export default router;
