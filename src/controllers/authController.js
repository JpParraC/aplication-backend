// src/controllers/authController.js
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import { pool } from '../routes/db.js';
import { getUserByStaffId } from '../models/users.js';
import { rolePermissions } from '../config/permissions.js'; // Asegúrate de ajustar la ruta

// Función para actualizar todas las contraseñas de los usuarios
export const updateAllUserPasswords = async () => {
  try {
    const query = 'SELECT id, password FROM users'; // Selecciona los usuarios
    const { rows } = await pool.query(query); // Obtiene todos los usuarios

    // Itera sobre cada usuario y actualiza su contraseña
    for (const user of rows) {
      const hashedPassword = await bcrypt.hash(user.password, 10); // Hashea la contraseña
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]); // Actualiza la contraseña en la base de datos
    }

    console.log('Contraseñas actualizadas correctamente');
  } catch (error) {
    console.error('Error al actualizar las contraseñas:', error);
  }
};

// Controlador para manejar el login
// Controlador para manejar el login
export const login = async (req, res) => {
  const { staff_id, password } = req.body;

  // Log para ver los datos de entrada
  console.log('Datos recibidos:', { staff_id, password });

  // Asegúrate de que staff_id sea un número
  if (isNaN(staff_id)) {
    return res.status(400).json({ message: 'Staff ID debe ser un número válido' });
  }

  try {
    // Buscar al usuario por su staff_id
    const user = await getUserByStaffId(staff_id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Verificar los permisos para el rol del usuario
    const permissions = rolePermissions[user.role_id] || [];
    console.log('Permisos del usuario:', permissions); // Verifica los permisos

    // Generar un token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        staff_id: user.staff_id, 
        role_id: user.role_id, 
        permissions: permissions // Agregar permisos al token
      },
      process.env.JWT_SECRET, // Clave secreta definida en tu archivo de configuración
      { expiresIn: '1h' } // Expiración del token
    );

    // Log para verificar el contenido del token
    console.log('Token generado con permisos:', { 
      id: user.id, 
      staff_id: user.staff_id, 
      role_id: user.role_id, 
      permissions: permissions 
    });

    // Responder con el token
    res.status(200).json({ token, permissions, message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error('Error al procesar el login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Exporta otras funciones si es necesario
