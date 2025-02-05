import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener un usuario por email
export const getUserByEmail = async (email) => {
  try {
    const result = await prisma.$queryRaw`
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
      INNER JOIN staff s ON u.staff_id = s.id_staff 
      WHERE s.email_staff = ${email}
      LIMIT 1;
    `;
    return result[0];
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    throw error;
  }
};

// Obtener un usuario por staff_id
export const getUserByStaffId = async (staffId) => {
  try {
    const result = await prisma.$queryRaw`
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
      WHERE u.staff_id = ${staffId}
      LIMIT 1;
    `;
    return result[0];
  } catch (error) {
    console.error('Error al obtener usuario por staff_id:', error);
    throw error;
  }
};

// Obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM users;
    `;
    return result;
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    throw error;
  }
};

// Crear un nuevo usuario
export const createUser = async ({ password, role_id, staff_id }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.$queryRaw`
      INSERT INTO users (password, role_id, staff_id, created_at)
      VALUES (${hashedPassword}, ${role_id}, ${staff_id}, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
};

// Actualizar la contraseña de un usuario por su `email`
export const updateUserPassword = async (email, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await prisma.$queryRaw`
      UPDATE users
      SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT staff_id FROM staff WHERE email_staff = ${email} LIMIT 1)
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    throw error;
  }
};

// Actualizar el `role_id` o cualquier otra información del usuario
export const updateUser = async (id, { password, role_id }) => {
  try {
    const result = await prisma.$queryRaw`
      UPDATE users
      SET password = ${password}, role_id = ${role_id}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};

// Eliminar un usuario por su `id`
export const deleteUser = async (staff_id) => {
  try {
    const result = await prisma.$queryRaw`
      DELETE FROM users WHERE staff_id = ${staff_id} RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    throw error;
  }
};

// Crear un nuevo código de restablecimiento de contraseña o actualizarlo si ya existe
export const createPasswordResetCode = async (email, code, expirationTime) => {
  try {
    const result = await prisma.$queryRaw`
      INSERT INTO password_reset (email, reset_code, expires_at)
      VALUES (${email}, ${code}, ${expirationTime})
      ON CONFLICT (email)
      DO UPDATE SET reset_code = ${code}, expires_at = ${expirationTime}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error al crear el código de restablecimiento:', error);
    throw error;
  }
};

// Obtener el código de restablecimiento y verificar si es válido
export const getPasswordResetCode = async (email, code) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT reset_code, expires_at, used
      FROM password_reset
      WHERE email = ${email} AND reset_code = ${code};
    `;
    return result[0];
  } catch (error) {
    console.error('Error al obtener el código de restablecimiento:', error);
    throw error;
  }
};

// Marcar el código como utilizado después de que se restablezca la contraseña
export const markResetCodeAsUsed = async (email, code) => {
  try {
    const result = await prisma.$queryRaw`
      UPDATE password_reset
      SET used = TRUE
      WHERE email = ${email} AND reset_code = ${code}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error al marcar el código como utilizado:', error);
    throw error;
  }
};

