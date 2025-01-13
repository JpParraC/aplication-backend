// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

// Middleware para verificar el token y los permisos
export const authenticateAndAuthorize = (requiredPermission) => {
  return (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }

      // Asignamos la información del usuario al objeto `req`
      req.user = user;

      // Verificar si el usuario tiene el permiso requerido
      if (!user.permissions || !user.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'No tiene permisos para acceder a esta ruta' });
      }

      // Si el token es válido y el usuario tiene el permiso, continuamos con la ruta
      next();
    });
  };
};
