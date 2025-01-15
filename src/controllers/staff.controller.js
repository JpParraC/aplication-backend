// controllers/staffController.js
import { pool } from '../routes/db.js';  // Asegúrate de que la conexión a la base de datos esté correctamente configurada

// Obtener todos los empleados (staff)
export const getStaff = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM staff ORDER BY id_staff ASC');  // Se elimina el LIMIT
    res.json(result.rows);  // Retorna todos los empleados
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Obtener un empleado por su ID
export const getStaffById = async (req, res) => {
  const { id } = req.params;  // Obtener el id del empleado desde los parámetros de la URL
  try {
    const result = await pool.query('SELECT * FROM staff WHERE id_staff = $1', [id]);
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);  // Si se encuentra el empleado, devolver la información
    } else {
      res.status(404).send('Staff not found');  // Si no se encuentra, devolver un error 404
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Crear un nuevo empleado
export const createStaff = async (req, res) => {
  const { id_staff, name_staff, lastname_staff, email_staff, phone, rol_id } = req.body;

  // Validar datos de entrada
  if (!id_staff || !name_staff || !lastname_staff || !email_staff || !phone || !rol_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO staff (id_staff, name_staff, lastname_staff, email_staff, phone, rol_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_staff, name_staff, lastname_staff, email_staff, phone, rol_id]
    );
    res.status(201).json(result.rows[0]);  // Devolver el empleado recién creado
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Actualizar un empleado
export const updateStaff = async (req, res) => {
  const { id } = req.params;  // Obtener el id del empleado desde los parámetros de la URL
  const { id_staff, name_staff, lastname_staff, email_staff, phone, rol_id } = req.body;

  // Validar datos de entrada
  if (!id_staff || !name_staff || !lastname_staff || !email_staff || !phone || !rol_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE staff SET 
        id_staff = $1, 
        name_staff = $2, 
        lastname_staff = $3, 
        email_staff = $4, 
        phone = $5, 
        rol_id = $6 
      WHERE id_staff = $7 RETURNING *`,
      [id_staff, name_staff, lastname_staff, email_staff, phone, rol_id, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);  // Devolver el empleado actualizado
    } else {
      res.status(404).json({ message: "Staff not found" });  // Si no se encuentra el empleado, devolver un error 404
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Eliminar un empleado
export const deleteStaff = async (req, res) => {
  const { id } = req.params;  // Obtener el id del empleado desde los parámetros de la URL
  console.log(`ID received for deletion: ${id}`);  // Depuración para comprobar si el id es correcto

  try {
    // Realizar la eliminación del empleado
    const { rowCount } = await pool.query('DELETE FROM staff WHERE id_staff = $1', [id]);
    console.log(`Rows affected by DELETE: ${rowCount}`);  // Verificar cuántas filas fueron afectadas

    // Si no se eliminó ninguna fila, el empleado no se encontró
    if (rowCount === 0) {
      return res.status(404).json({ message: "Staff not found" });
    } else {
      return res.json({ message: "Staff successfully deleted" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};
