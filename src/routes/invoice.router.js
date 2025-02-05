import express from 'express';
import {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
} from '../controllers/invoice.controller.js';

const router = express.Router();

router.get('/', getInvoices);        // Obtener todas las facturas
router.get('/:id', getInvoiceById);  // Obtener una factura por ID
router.post('/', createInvoice);     // Crear una nueva factura
router.patch('/:id', updateInvoice);   // Actualizar una factura existente
router.delete('/:id', deleteInvoice); // Eliminar una factura

export default router;
