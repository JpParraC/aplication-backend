import { createUser, getAllUsers, getUserByStaffId, updateUser, updateUserPassword, deleteUser } from '../models/users.js';
import { pool } from '../routes/db.js';  // Asegúrate de que la conexión a la base de datos esté correctamente configurada

// Obtener todos los usuarios
export const getAdmins = async (req, res) => {
  try {
    const admins = await getAllUsers();
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
};



// Crear un nuevo administrador
export const addAdmin = async (req, res) => {
  const { password, role_id, staff_id } = req.body;

  // Verificar si faltan campos
  if (!password || !role_id || !staff_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Verificar si el staff_id existe en la tabla 'staff'
    const staffResult = await pool.query('SELECT * FROM staff WHERE id_staff = $1', [staff_id]);
    if (staffResult.rows.length === 0) {
      return res.status(404).json({ message: 'Staff ID not found' });
    }

    // Si el staff_id existe, crear el nuevo administrador
    const newAdmin = await createUser({ password, role_id, staff_id });
    res.status(201).json(newAdmin);

  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin' });
  }
};

// Obtener un administrador por `staff_id`
export const getAdminByStaffId = async (req, res) => {
  const { staffId } = req.params;

  try {
    const admin = await getUserByStaffId(staffId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Error fetching admin' });
  }
};

// Actualizar los datos de un administrador
export const editAdmin = async (req, res) => {
  const { id } = req.params;
  const { password, role_id } = req.body;

  if (!password && !role_id) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  try {
    const updatedAdmin = await updateUser(id, { password, role_id });
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Error updating admin' });
  }
};

// Eliminar un administrador
export const removeAdmin = async (req, res) => {
  const { staff_id } = req.params;

  try {
    const deletedAdmin = await deleteUser(staff_id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Error deleting admin' });
  }
};

export const getAllUsersWithDetails = async (req, res) => {
  const query = `
          SELECT 
        u.id AS user_id,
        u.staff_id,
        u.password,
        u.role_id AS user_role_id,
        u.created_at AS user_created_at,
        u.updated_at AS user_updated_at,
        s.id AS staff_db_id,
        s.id_staff,
        s.name_staff,
        s.lastname_staff,
        s.email_staff,
        s.phone,
        s.rol_id AS staff_role_id,
        s.gen,
        s.created_at AS staff_created_at,
        s.updated_at AS staff_updated_at, 
        r.rol_name AS staff_role_name
    FROM users u
    LEFT JOIN staff s ON u.staff_id = s.id_staff
    LEFT JOIN roles r ON s.rol_id = r.id;
        `;

  try {
    const { rows } = await pool.query(query);
    res.json(rows); // Aquí estamos enviando la respuesta con los usuarios y sus detalles
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};


export const updateAdmin = async (req, res) => {
  const { name_staff, lastname_staff, email_staff, phone, staff_role_name } = req.body;
  const staff_id = req.params.id_staff; // Aquí lees el id_staff desde los parámetros de la URL

  // Comienza con una lista de parámetros para los valores a actualizar
  const values = [name_staff, lastname_staff, email_staff, phone];

  // Agregar el staff_role_name solo si está presente
  let roleQuery = '';
  if (staff_role_name) {
    roleQuery = `, rol_id = (SELECT id FROM roles WHERE rol_name = $${values.length + 1})`;
    values.push(staff_role_name);  // Agregar el rol a los valores
  }

  // Agregar el id_staff al final para el WHERE
  values.push(staff_id);

  // Query para actualizar el administrador
  const query = `
    UPDATE staff
    SET 
      name_staff = $1,
      lastname_staff = $2,
      email_staff = $3,
      phone = $4
      ${roleQuery}  -- Si se pasa un rol, lo actualizamos
    WHERE id_staff = $${values.length}
    RETURNING *;
  `;

  try {
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    res.json({
      message: 'Administrador actualizado correctamente',
      updatedAdmin: rows[0], // Devuelves el administrador actualizado
    });

  } catch (error) {
    console.error('Error al actualizar el administrador:', error);
    res.status(500).json({ message: 'Error al actualizar el administrador' });
  }
};
