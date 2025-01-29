import express from 'express';
import {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
} from '../controllers/payment.controller.js';

const router = express.Router();

router.get('/', getPayments);        // Obtener todos los pagos
router.get('/:id', getPaymentById);  // Obtener un pago por ID
router.post('/', createPayment);     // Crear un nuevo pago
router.put('/:id', updatePayment);   // Actualizar un pago existente
router.delete('/:id', deletePayment); // Eliminar un pago

export default router;
