import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Controlador para obtener los datos del Dashboard
const getDashboardData = async (req, res) => {
  try {
    // Obtener el mes y año actual
    const currentMonth = new Date().getMonth() + 1; // Mes actual (1-indexed)
    const currentYear = new Date().getFullYear(); // Año actual

    // Obtener los clientes registrados en el mes actual
    const totalClients = await prisma.guests.count({
      where: {
        created_at: {
          gte: new Date(currentYear, currentMonth - 1, 1), // Primer día del mes actual
          lt: new Date(currentYear, currentMonth, 1), // Primer día del siguiente mes
        },
      },
    });

    // Obtener las habitaciones disponibles
    const totalRooms = await prisma.rooms.count();

    // Obtener las reservas realizadas en el mes actual
    const totalReservations = await prisma.reservation.count({
      where: {
        date_reserve: {
          gte: new Date(currentYear, currentMonth - 1, 1), // Primer día del mes actual
          lt: new Date(currentYear, currentMonth, 1), // Primer día del siguiente mes
        },
      },
    });

    // Obtener el personal registrado
    const totalStaff = await prisma.staff.count();

    // Enviar los datos del Dashboard como respuesta
    res.json({
      totalClients,
      totalRooms,
      totalReservations,
      totalStaff,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

export { getDashboardData };
