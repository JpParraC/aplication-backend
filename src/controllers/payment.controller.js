import { pool } from '../routes/db.js';

// Obtener todos los pagos
export const getPayments = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                pd.id,
                pd.notes,
                pd.date_pay,
                pd.invoice_id, 
                pd.mount,
                pm.method_name
            FROM payment_detail pd
            JOIN payment_method pm ON pd.id_payment_method = pm.id;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

// Obtener un pago por ID
export const getPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT pd.*, pm.method_name 
            FROM payment_detail pd
            JOIN payment_method pm ON pd.id_payment_method = pm.id
            WHERE pd.id = $1
        `, [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Payment not found');
        }
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

export const createPayment = async (req, res) => {
    const { notes, date_pay, id_payment_method, invoice_id, mount } = req.body;

    try {
        // Iniciar transacción
        await pool.query('BEGIN');
        
        // 1. Insertar el pago en la tabla payment_detail
        const result = await pool.query(
            `INSERT INTO payment_detail (notes, date_pay, id_payment_method, invoice_id, mount) 
             VALUES ($1, COALESCE($2, NOW()), $3, $4, $5) RETURNING *`,
            [notes, date_pay, id_payment_method, invoice_id, mount]
        );

        // 2. Obtener el monto pendiente actual de la factura
        const invoiceResult = await pool.query(
            `SELECT total_amount, mount_pending FROM invoice WHERE id = $1`,
            [invoice_id]
        );

        if (invoiceResult.rows.length === 0) {
            return res.status(404).send('Invoice not found');
        }

        const {total_amount, mount_pending } = invoiceResult.rows[0];

        // 3. Calcular el nuevo monto pendiente (restando el monto del pago)
        const newMountPending = mount_pending - mount;

        // 4. Actualizar la factura con el nuevo monto pendiente
        await pool.query(
            `UPDATE invoice SET mount_pending = $1 WHERE id = $2`,
            [newMountPending, invoice_id]
        );

        // Confirmar la transacción
        await pool.query('COMMIT');

        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Si ocurre un error, revertir la transacción
        await pool.query('ROLLBACK');
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

  
export const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { notes, id_payment_method, invoice_id, mount } = req.body;

    try {
        const result = await pool.query(
            `UPDATE payment_detail SET 
                notes = $1, 
                id_payment_method = $2, 
                invoice_id = $3, 
                mount = $4
             WHERE id = $5 RETURNING *`,
            [notes, id_payment_method, invoice_id, mount, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};


// Eliminar un pago
export const deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query('DELETE FROM payment_detail WHERE id = $1', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Payment not found" });
        } else {
            return res.json({ message: "Payment successfully deleted" });
        }
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};
