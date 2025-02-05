import jwt from 'jsonwebtoken';
import { rolePermissions } from '../config/permissions.js'; // Asegúrate de que la ruta sea correcta

export const authenticateAndAuthorize = (requiredPermission) => {
  return (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Obtener el token (Bearer <token>)

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }

      req.user = user;

      // Obtener los permisos del rol del usuario
      const userPermissions = rolePermissions[user.role_id] || []; // Asignamos permisos basados en el rol del usuario

      // Verificar si el usuario tiene el permiso requerido
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: `Acceso denegado: Se requiere el permiso '${requiredPermission}' para esta acción`
        });
      }

      // Si el usuario tiene el permiso, continuamos con la ruta
      next();
    });
  };
};
