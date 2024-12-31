// utils/authUtils.js
import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key';  // Cambia esto por una clave secreta más segura

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    first_name: user.first_name,
    email: user.email,
  };

  // Genera el token
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });  // Expira en 1 hora
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);  // Verifica y decodifica el token
  } catch (error) {
    throw new Error('Invalid token');
  }
};
