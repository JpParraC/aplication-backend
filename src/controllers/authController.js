import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../routes/db.js';
import { getUserByStaffId } from '../models/users.js';
import { rolePermissions } from '../config/permissions.js';


const generateAccessToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
  console.log('Token generado:', token); 
  return token;
};


export const login = async (req, res) => {
  const { staff_id, password } = req.body;


  console.log('Datos recibidos:', { staff_id, password });


  if (isNaN(staff_id)) {
    return res.status(400).json({ message: 'Staff ID debe ser un número válido' });
  }

  try {
    // Busca usuario 
    const user = await getUserByStaffId(staff_id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    
    const permissions = rolePermissions[user.role_id] || [];
    console.log('Permisos del usuario:', permissions); // Verifica los permisos

    // Generar el token JWT con los permisos
    const userPayload = {
      id: user.id,
      staff_id: user.staff_id,
      role_id: user.role_id,
      permissions: permissions,  // Asegúrate de incluir los permisos aquí
    };

    const accessToken = generateAccessToken(userPayload);

    // Log para verificar el contenido del token
    console.log('Token generado con permisos:', { 
      id: user.id, 
      staff_id: user.staff_id, 
      role_id: user.role_id, 
      permissions: permissions 
    });

    // Responder con el token y los permisos
    res.status(200).json({ accessToken, permissions, message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error('Error al procesar el login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const refresh = (req, res) => {
  res.status(400).json({ message: 'Ya no se requiere el refresh token' });
};


export const logout = async (req, res) => {
  try {
   
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
