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
        const result = await pool.query(`
            SELECT 
                id,
                reservation_id,
                total_amount,
                mount_pending,
                date_invoice,
                status,
                created_at,
                updated_at
            FROM invoice
            WHERE id = $1
        `, [id]);

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
        // 🔹 Obtener la cantidad de noches y calcular el total_amount en una sola consulta
        const query = `
            SELECT 
                r.number_nights, 
                SUM(rt.price) AS total_amount
            FROM reservation r
            JOIN rooms ro ON ro.id = ANY(r.rooms)
            JOIN room_type rt ON rt.id = ro.room_type_id
            WHERE r.id = $1
            GROUP BY r.number_nights;
        `;

        const result = await pool.query(query, [reservation_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reservation or rooms not found" });
        }

        const { number_nights, total_amount } = result.rows[0];

        // 🔹 Multiplicar el precio total por la cantidad de noches
        const final_total_amount = total_amount * number_nights;
        const mount_pending = final_total_amount;
        const status = 1; // Factura pendiente

        // 🔹 Insertar la factura
        const insertQuery = `
            INSERT INTO invoice (date_invoice, total_amount, status, reservation_id, mount_pending) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;

        const invoiceResult = await pool.query(insertQuery, [
            date_invoice, final_total_amount, status, reservation_id, mount_pending
        ]);

        res.status(201).json(invoiceResult.rows[0]);

    } catch (err) {
        console.error('Error in query:', err.stack);
        res.status(500).send('Database error');
    }
};
export const updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { date_invoice, total_amount, status, reservation_id, mount_pending } = req.body;

    try {
        // Si mount_pending llega a 0, actualizamos el estado a 0 (pagado)
        let newStatus = status;
        if (mount_pending === 0) {
            newStatus = 0; // Status 0 representa "Pagado"
        }

        // Creamos un array con los campos que se van a actualizar y sus valores
        const values = [];
        const updates = [];

        // Verificar y agregar el campo de la fecha
        if (date_invoice) {
            updates.push(`date_invoice = $${updates.length + 1}`);
            values.push(date_invoice);
        }

        // Verificar y agregar el campo de total_amount
        if (total_amount) {
            updates.push(`total_amount = $${updates.length + 1}`);
            values.push(total_amount);
        }

        // Verificar y agregar el campo de status
        if (newStatus !== undefined) {
            updates.push(`status = $${updates.length + 1}`);
            values.push(newStatus);
        }

        // Verificar y agregar el campo de reservation_id
        if (reservation_id) {
            updates.push(`reservation_id = $${updates.length + 1}`);
            values.push(reservation_id);
        }

        // Verificar y agregar el campo de mount_pending
        if (mount_pending !== undefined) {
            updates.push(`mount_pending = $${updates.length + 1}`);
            values.push(mount_pending);
        }

        // Si no hay cambios, responder con un error
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Agregar el ID al final de los valores
        values.push(id);

        // Construir la consulta de actualización dinámicamente
        const query = `
            UPDATE invoice SET 
                ${updates.join(', ')}
            WHERE id = $${values.length}
            RETURNING *`;

        const result = await pool.query(query, values);

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
