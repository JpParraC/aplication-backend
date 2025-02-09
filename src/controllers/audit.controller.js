import { pool } from '../routes/db.js'; 

// Controlador para obtener los registros de la tabla de auditoría
const getAuditData = async (req, res) => {
  try {
    // Realizar la consulta para obtener los registros de la tabla 'audit' ordenados por 'timestamp'
    const result = await pool.query(
      'SELECT * FROM audit ORDER BY timestamp DESC'
    );

    // Enviar los registros de auditoría como respuesta
    res.json(result.rows); // result.rows contiene los registros de la tabla audit
  } catch (error) {
    console.error('Error fetching audit data:', error);
    res.status(500).json({ message: 'Error fetching audit data' });
  }
};

export { getAuditData };
