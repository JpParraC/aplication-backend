import { pool } from '../routes/db.js';

// Obtener todos los pagos
export const getPayments = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                pd.id,
                pd.notes,
                pd.date_pay,
                pd.time,
                pd.invoice_id, pd.mount,
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

// Crear un nuevo pago
export const createPayment = async (req, res) => {
    const { notes, date_pay, time, id_payment_method, invoice_id, mount } = req.body;

   
    try {
        const result = await pool.query(
            `INSERT INTO payment_detail (notes, date_pay, time, id_payment_method, invoice_id, mount) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [notes, date_pay, time, id_payment_method, invoice_id, mount]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

// Actualizar un pago
export const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { notes, date_pay, time, id_payment_method, invoice_id, mount } = req.body;

  

    try {
        const result = await pool.query(
            `UPDATE payment_detail SET 
                notes = $1, 
                date_pay = $2, 
                time = $3, 
                id_payment_method = $4, 
                invoice_id = $5 ,
                mount = $6
             WHERE id = $7 RETURNING *`,
            [notes, date_pay, time, id_payment_method, invoice_id, mount, id]
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
