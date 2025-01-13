import { pool } from '../routes/db.js';
import bcrypt from 'bcrypt';

// Obtener un usuario por su `staff_id`
export const getUserByStaffId = async (staffId) => {
  const query = 'SELECT * FROM users WHERE staff_id = $1';
  const values = [staffId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Obtener todos los usuarios
export const getAllUsers = async () => {
  const query = 'SELECT * FROM users';
  const { rows } = await pool.query(query);
  return rows;
};

// Crear un nuevo usuario
export const createUser = async ({ password, role_id, staff_id }) => {
  // Cifrar la contraseña antes de almacenarla
  const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de saltos
  const query = `
    INSERT INTO users (password, role_id, staff_id, created_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    RETURNING *`;
  const values = [hashedPassword, role_id, staff_id];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna el usuario creado
};

// Actualizar la contraseña de un usuario por su `id`
export const updateUserPassword = async (id, newPassword) => {
  // Cifrar la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = `
    UPDATE users
    SET password = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *`;
  const values = [hashedPassword, id];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna el usuario actualizado
};

// Actualizar el `role_id` o cualquier otra información del usuario
export const updateUser = async (id, { password, role_id }) => {
  // Si no hay nueva contraseña, solo actualiza el role_id
  const query = `
    UPDATE users
    SET password = $1, role_id = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *`;
  const values = [password, role_id, id];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna el usuario actualizado
};

// Eliminar un usuario por su `id`
export const deleteUser = async (id) => {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna el usuario eliminado
};
