// controllers/authController.js
import bcrypt from 'bcryptjs';
import { pool } from '../routes/db.js';
import { generateToken } from '../utils/authutils.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM guests WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compara la contraseña proporcionada con la guardada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Genera un token JWT
    const token = generateToken(user);
    res.json({ token });  // Devuelve el token al usuario
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).send('Server error');
  }
};
