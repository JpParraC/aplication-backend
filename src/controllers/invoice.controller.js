import { pool } from '../routes/db.js';

// Obtener todas las facturas
export const getInvoices = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM invoice');
        res.json(result.rows);
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

// Obtener una factura por ID
export const getInvoiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM invoice WHERE id = $1', [id]);
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

// Crear una nueva factura
export const createInvoice = async (req, res) => {
    const { date_invoice, total_amount, status, reservation_id } = req.body;

    if (!date_invoice || !total_amount || !status || !reservation_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Verificar si la reserva existe
        const reservationCheck = await pool.query(
            `SELECT id FROM reservation WHERE id = $1`,
            [reservation_id]
        );

        if (reservationCheck.rows.length === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Insertar la factura si la reserva existe
        const result = await pool.query(
            `INSERT INTO invoice (date_invoice, total_amount, status, reservation_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [date_invoice, total_amount, status, reservation_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

// Actualizar una factura
export const updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { date_invoice, total_amount, status, reservation_id } = req.body;

    if (!date_invoice || !total_amount || !status || !reservation_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await pool.query(
            `UPDATE invoice SET 
                date_invoice = $1, 
                total_amount = $2, 
                status = $3, 
                reservation_id = $4 
             WHERE id = $5 RETURNING *`,
            [date_invoice, total_amount, status, reservation_id, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: "Invoice not found" });
        }
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

// Eliminar una factura
export const deleteInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query('DELETE FROM invoice WHERE id = $1', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Invoice not found" });
        } else {
            return res.json({ message: "Invoice successfully deleted" });
        }
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};
