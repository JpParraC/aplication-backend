// authController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { getUserByEmail, updateUserPassword, createPasswordResetCode, getPasswordResetCode } from '../models/users.js';
import { rolePermissions } from '../config/permissions.js';

const resend = new Resend("re_MGSJ1Pt7_Cg5UEyJCSEGsxZQ4BGUfpe8a");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '2h' });
};

// Función de login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'El email y la contraseña son requeridos' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const permissions = rolePermissions[user.user_role_id] || [];
    const userPayload = {
      user_id: user.user_id,
      staff_id: user.staff_id,
      role_id: user.user_role_id,
      permissions,
      name: user.name_staff,
      lastname: user.lastname_staff,
      email: user.email_staff,
      phone: user.phone,
      gen: user.gen,
      created_at: user.staff_created_at,
      updated_at: user.staff_updated_at,
    };

    const accessToken = generateAccessToken(userPayload);
    res.status(200).json({ accessToken, permissions, message: 'Inicio de sesión exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función de logout
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para solicitar el código de restablecimiento de contraseña
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El email es requerido' });
  }

  try {
    // Verificamos si el usuario existe
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No se encontró un usuario con este correo' });
    }

    // Generar un nuevo código
    const code = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // Expira en 1 hora

    // Guardar el código en la base de datos
    await createPasswordResetCode(email, code, expirationTime);

    // Crear el contenido del correo
    const emailContent = {
      from: 'onboarding@resend.dev', // Reemplaza con tu dirección de correo
      to: email,
      subject: 'Código de restablecimiento de contraseña',
      html: `<p>Tu código de restablecimiento de contraseña es: <strong>${code}</strong></p>`,
    };

    // Enviar el código por correo
    await resend.emails.send(emailContent);  // Enviar el email con el código

    res.json({ message: 'Código de restablecimiento enviado a tu correo' });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
};

// Función para restablecer la contraseña
export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: 'Email, código y nueva contraseña son requeridos' });
  }

  try {
    // Verificar si el código existe en la base de datos
    const resetData = await getPasswordResetCode(email, code);

    if (!resetData) {
      return res.status(400).json({ message: 'No se encontró un código de restablecimiento válido para este correo' });
    }

    const { expires_at, used } = resetData;

    // Verificar si el código ya ha sido utilizado
    if (used) {
      return res.status(400).json({ message: 'Este código ya ha sido utilizado' });
    }

    // Verificar si el código ha expirado
    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ message: 'El código ha expirado' });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    await updateUserPassword(email, hashedPassword);

    // Marcar el código como utilizado en la base de datos
    await markResetCodeAsUsed(email, code);

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error("Error al procesar el restablecimiento de la contraseña:", error);
    res.status(500).json({ message: 'Error al procesar el restablecimiento de la contraseña' });
  }
};
