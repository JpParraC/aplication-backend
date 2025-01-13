import { pool } from '../routes/db.js'; // Asegúrate de importar tu conexión a la base de datos

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Hubo un error al obtener los roles' });
  }
};

// Obtener un rol específico por ID
export const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el rol:', error);
    res.status(500).json({ message: 'Hubo un error al obtener el rol' });
  }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
  const { rol_name } = req.body; // Recibimos solo el nombre del rol

  try {
    const result = await pool.query(
      'INSERT INTO roles (rol_name) VALUES ($1) RETURNING *',
      [rol_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el rol:', error);
    res.status(500).json({ message: 'Hubo un error al crear el rol' });
  }
};

// Actualizar un rol existente
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { rol_name } = req.body;

  try {
    const result = await pool.query(
      'UPDATE roles SET rol_name = $1 WHERE id = $2 RETURNING *',
      [rol_name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar el rol' });
  }
};

// Eliminar un rol
export const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    res.status(200).json({ message: 'Rol eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    res.status(500).json({ message: 'Hubo un error al eliminar el rol' });
  }
};
