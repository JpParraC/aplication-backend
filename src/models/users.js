import { pool } from '../routes/db.js';
import bcrypt from 'bcrypt';

// Obtener un usuario por email
export const getUserByEmail = async (email) => {
  const query = `
    SELECT 
      u.id AS user_id,
      u.staff_id,
      u.password,
      u.role_id AS user_role_id,
      u.created_at AS user_created_at,
      u.updated_at AS user_updated_at,
      s.id AS staff_id,
      s.name_staff,
      s.lastname_staff,
      s.email_staff,
      s.phone,
      s.rol_id AS staff_role_id,
      s.gen,
      s.created_at AS staff_created_at,
      s.updated_at AS staff_updated_at
    FROM users u
    INNER JOIN staff s ON u.staff_id = s.id
    WHERE s.email_staff = $1
    LIMIT 1;
  `;

  try {
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    throw error;
  }
};

// Obtener un usuario por staff_id
export const getUserByStaffId = async (staffId) => {
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
      s.updated_at AS staff_updated_at
    FROM users u
    INNER JOIN staff s ON u.staff_id = s.id
    WHERE u.staff_id = $1
    LIMIT 1;
  `;

  try {
    const { rows } = await pool.query(query, [staffId]);
    return rows[0]; // Devuelve el usuario si existe
  } catch (error) {
    console.error('Error al obtener usuario por staff_id:', error);
    throw error;
  }
};

// Obtener todos los usuarios
export const getAllUsers = async () => {
  const query = 'SELECT * FROM users';
  const { rows } = await pool.query(query);
  return rows;
};

// Crear un nuevo usuario
export const createUser = async ({ password, role_id, staff_id }) => {
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
export const updateUserPassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = `
    UPDATE users
    SET password = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = (SELECT staff_id FROM staff WHERE email_staff = $2 LIMIT 1)
    RETURNING *`;
  const values = [hashedPassword, email];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna el usuario actualizado
};

// Actualizar el `role_id` o cualquier otra información del usuario
export const updateUser = async (id, { password, role_id }) => {
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

// Crear un nuevo código de restablecimiento de contraseña o actualizarlo si ya existe
export const createPasswordResetCode = async (email, code, expirationTime) => {
  const query = `
    INSERT INTO password_reset (email, reset_code, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (email)
    DO UPDATE SET reset_code = $2, expires_at = $3
    RETURNING *`;
  const values = [email, code, expirationTime];
  const { rows } = await pool.query(query, values);
  return rows[0];  // Retorna el código de restablecimiento generado
};

// Obtener el código de restablecimiento y verificar si es válido
export const getPasswordResetCode = async (email, code) => {
  const query = `
    SELECT reset_code, expires_at, used
    FROM password_reset
    WHERE email = $1 AND reset_code = $2`;
  const { rows } = await pool.query(query, [email, code]);

  return rows[0];  // Retorna el código y su estado (si es válido)
};

// Marcar el código como utilizado después de que se restablezca la contraseña
export const markResetCodeAsUsed = async (email, code) => {
  const query = `
    UPDATE password_resets
    SET used = TRUE
    WHERE email = $1 AND reset_code = $2
    RETURNING *`;
  const { rows } = await pool.query(query, [email, code]);
  return rows[0];  // Retorna el estado actualizado
};
