import { pool } from '../routes/db.js';

export const getPayments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM get_payments()');
        res.json(result.rows);
    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};
export const getPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM get_payment_by_id($1)', [id]);

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
    const { notes, id_payment_method, invoice_id, mount, number_transaction, date_pay } = req.body;

    try {
        // Iniciar transacción
        await pool.query('BEGIN');
        
        // Llamar al procedimiento almacenado
        await pool.query(
            'CALL create_payment($1, $2, $3, $4, $5, $6)', 
            [notes, id_payment_method, invoice_id, mount, number_transaction, date_pay]  // Pasamos el valor de date_pay, si no se pasa, se usará el valor por defecto
        );

        // Confirmar la transacción
        await pool.query('COMMIT');

        res.status(201).json({ message: 'Payment created successfully' });
    } catch (err) {
        // Si ocurre un error, revertir la transacción
        await pool.query('ROLLBACK');
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};


  
export const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { notes, id_payment_method, invoice_id, mount, number_transaction } = req.body;

    try {
        // Iniciar transacción
        await pool.query('BEGIN');
        
        // Llamar al procedimiento de actualización
        await pool.query(
            'CALL update_payment($1, $2, $3, $4, $5, $6)', 
            [id, notes, id_payment_method, invoice_id, mount, number_transaction]
        );

        // Confirmar la transacción
        await pool.query('COMMIT');

        res.json({ message: 'Payment updated successfully' });
    } catch (err) {
        // Si ocurre un error, revertir la transacción
        await pool.query('ROLLBACK');
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};


export const deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        // Iniciar transacción
        await pool.query('BEGIN');
        
        // Llamar al procedimiento de eliminación
        await pool.query('CALL delete_payment($1)', [id]);

        // Confirmar la transacción
        await pool.query('COMMIT');

        res.json({ message: 'Payment successfully deleted' });
    } catch (err) {
        // Si ocurre un error, revertir la transacción
        await pool.query('ROLLBACK');
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};

