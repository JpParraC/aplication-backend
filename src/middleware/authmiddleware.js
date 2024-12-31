// middleware/authMiddleware.js
import { verifyToken } from '../utils/authutils';

export const verifyTokenMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Obtener el token del encabezado Authorization

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  try {
    const decoded = verifyToken(token);  // Verifica y decodifica el token
    req.user = decoded;  // Agrega la información del usuario al objeto request
    next();  // Continúa con la siguiente función
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};
