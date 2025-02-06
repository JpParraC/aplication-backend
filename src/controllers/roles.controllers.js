import { pool } from '../routes/db.js'; // Asegúrate de importar tu conexión a la base de datos

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_all_roles()');
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
    const result = await pool.query('SELECT * FROM get_role_by_id($1)', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el rol:', error);
    res.status(500).json({ message: 'Hubo un error al obtener el rol' });
  }
};

export const createRole = async (req, res) => {
  const { rol_name } = req.body; // Recibimos solo el nombre del rol

  try {
    // Llamamos al procedimiento create_role pasando el rol_name como parámetro
    await pool.query('CALL create_role($1)', [rol_name]);
    res.status(201).json({ message: 'Rol creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el rol:', error);
    res.status(500).json({ message: 'Hubo un error al crear el rol' });
  }
};


export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { rol_name } = req.body;

  try {
    // Llamamos al procedimiento update_role pasando el id y rol_name como parámetros
    await pool.query('CALL update_role($1, $2)', [id, rol_name]);
    res.status(200).json({ message: 'Rol actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar el rol' });
  }
};


export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    // Llamamos al procedimiento delete_role pasando el id como parámetro
    await pool.query('CALL delete_role($1)', [id]);
    res.status(200).json({ message: 'Rol eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    res.status(500).json({ message: 'Hubo un error al eliminar el rol' });
  }
};
