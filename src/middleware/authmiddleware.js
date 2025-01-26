
import jwt from 'jsonwebtoken';
import { rolePermissions } from '../config/permissions.js'; // Asegúrate de ajustar la ruta


export const authenticateAndAuthorize = (requiredPermission) => {
  return (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    //crificar token 
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }

      
      req.user = user;

      // Verificar si el usuario tiene el rol necesario y el permiso requerido
      const userPermissions = rolePermissions[user.role_id] || []; // Obtenemos los permisos del rol

      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'No tiene permisos para acceder a esta ruta' });
      }

      // Si el token es válido y el usuario tiene el permiso, continuamos con la ruta
      next();
    });
  };
};
