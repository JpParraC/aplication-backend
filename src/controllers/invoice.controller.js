import { pool } from '../routes/db.js';

export const getInvoices = async (req, res) => {
    try {
        // Llamar a la función de base de datos `get_invoices`
        const result = await pool.query('SELECT * FROM get_invoices()');
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

export const getInvoiceById = async (req, res) => {
    const { id } = req.params;
    try {
        // Llamar a la función de base de datos `get_invoice_by_id` con el parámetro id
        const result = await pool.query('SELECT * FROM get_invoice_by_id($1)', [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Invoice not found');
        }
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

export const createInvoice = async (req, res) => {
    const { date_invoice, reservation_id } = req.body;

    try {
        // Llamar al procedimiento para crear la factura
        await pool.query('CALL create_invoice($1, $2)', [date_invoice, reservation_id]);
        
        res.status(201).json({ message: "Invoice created successfully" });
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

export const updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { date_invoice, total_amount, status, reservation_id, mount_pending } = req.body;

    try {
        // Llamar al procedimiento para actualizar la factura
        await pool.query('CALL update_invoice($1, $2, $3, $4, $5, $6)', [
            id, date_invoice, total_amount, status, reservation_id, mount_pending
        ]);

        res.status(200).json({ message: "Invoice updated successfully" });
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};


export const deleteInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        // Llamar al procedimiento para eliminar la factura
        await pool.query('CALL delete_invoice($1)', [id]);

        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

