import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Controlador para obtener los registros de la tabla de auditoría
const getAuditData = async (req, res) => {
  try {
    // Obtener todos los registros de la tabla 'audit'
    const auditRecords = await prisma.audit.findMany({
      orderBy: {
        timestamp: 'desc', // Ordenamos por la fecha (de más reciente a más antiguo)
      },
    });

    // Enviar los registros de auditoría como respuesta
    res.json(auditRecords);
  } catch (error) {
    console.error('Error fetching audit data:', error);
    res.status(500).json({ message: 'Error fetching audit data' });
  }
};

export { getAuditData };
