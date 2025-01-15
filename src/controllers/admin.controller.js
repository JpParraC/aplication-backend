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
  const { id } = req.params;

  try {
    const deletedAdmin = await deleteUser(id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Error deleting admin' });
  }
};
