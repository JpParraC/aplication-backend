
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import pkg from 'pg';
const { Pool } = pkg;
import { getUserByEmail, updateUserPassword, createPasswordResetCode, getPasswordResetCode } from '../models/users.js';
import { rolePermissions } from '../config/permissions.js';
import { DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_ADMIN_USER, DB_ADMIN_PASSWORD , DB_REC_PASSWORD, DB_REC_USER } from '../routes/config.js'; // Importar configuración de la base de datos

const resend = new Resend("re_MGSJ1Pt7_Cg5UEyJCSEGsxZQ4BGUfpe8a");

// Función para generar el token de acceso
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
    // Verificamos si el usuario existe
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificamos si la contraseña es correcta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Preparamos el payload para el token JWT
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

    // Generamos el token de acceso
    const accessToken = generateAccessToken(userPayload);

   // Decidir la conexión a la base de datos dependiendo del rol del usuario
let client;
if (user.user_role_id === 1) { // Si el rol es 1 (administrador)
  // Conexión a la base de datos con el usuario admin_user
  client = new Pool({
    user: DB_ADMIN_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_ADMIN_PASSWORD,
    port: DB_PORT,
  });

  // Imprimir la configuración de la conexión para el admin
  console.log('Conexión a la base de datos con admin_user:', {
    user: DB_ADMIN_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    port: DB_PORT,
  });

} else if (user.user_role_id === 2) { 
  // Conexión a la base de datos con el usuario receptionist_user
  client = new Pool({
    user: DB_REC_USER,  
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_REC_PASSWORD,
    port: DB_PORT,
  });

  // Imprimir la configuración de la conexión para el receptionist
  console.log('Conexión a la base de datos con receptionist_user:', {
    user: DB_REC_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    port: DB_PORT,
  });

} else {
  // Conexión a la base de datos con el usuario normal (esto puede aplicarse a otros roles si existiesen)
  client = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  // Imprimir la configuración de la conexión para el usuario normal
  console.log('Conexión a la base de datos con usuario normal:', {
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    port: DB_PORT,
  });
}



    // Obtener datos adicionales de la base de datos (por ejemplo, detalles del usuario)
    const dbClient = await client.connect();
    const dbResult = await dbClient.query('SELECT * FROM staff WHERE email_staff = $1', [email]);

    if (dbResult.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos adicionales del usuario' });
    }

    // Respuesta con el token de acceso
    res.status(200).json({
      accessToken,
      permissions,
      message: 'Inicio de sesión exitoso',
      user: dbResult.rows[0], // Enviar los datos del usuario desde la base de datos
    });

    dbClient.release();  // Liberar la conexión después de la consulta

  } catch (error) {
    console.error("Error en el login:", error);
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
