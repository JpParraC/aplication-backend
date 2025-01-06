import express from 'express';
import { checkRoomAvailability } from '../controllers/availability.controller.js';

const router = express.Router();

router.get('/', checkRoomAvailability);

export default router;
