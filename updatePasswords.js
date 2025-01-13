import { pool } from './src/routes/db.js'; // Asegúrate de que la ruta al archivo db.js es correcta
import bcrypt from 'bcrypt';

async function updatePasswords() {
  try {
    // Obtener todos los usuarios de la base de datos
    const res = await pool.query('SELECT * FROM users');
    const users = res.rows;

    // Recorrer todos los usuarios
    for (const user of users) {
      // Si la contraseña ya está cifrada, saltarla
      if (user.password && user.password.startsWith('$2b$')) {
        console.log(`La contraseña de ${user.staff_id} ya está cifrada`);
        continue;
      }

      // Cifrar la contraseña si no está cifrada
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Actualizar la contraseña en la base de datos
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, user.id]
      );

      console.log(`Contraseña de usuario ${user.staff_id} actualizada`);
    }

    console.log('Todas las contraseñas han sido actualizadas');
  } catch (error) {
    console.error('Error al actualizar contraseñas:', error);
  }
}

// Ejecutar la función para actualizar las contraseñas
updatePasswords();

