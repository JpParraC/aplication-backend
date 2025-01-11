import { pool } from '../routes/db.js';

export const checkRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkin, checkout } = req.query;
    console.log(req.query); 
    // Verificar que los parámetros necesarios estén presentes
    if (!roomId || !checkin || !checkout) {
      return res.status(400).json({ message: 'Room ID, check-in, and check-out dates are required' });
    }

    // Convertir roomId a un entero
    const roomIdInt = parseInt(roomId, 10);
    if (isNaN(roomIdInt)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }

    // Verificar que las fechas sean válidas
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date' });
    }

    if (checkinDate >= checkoutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Consulta SQL para verificar si hay solapamiento de fechas
    const query = `
      SELECT COUNT(*) AS conflict_count
      FROM reservation
      WHERE $1 = ANY(rooms)
        AND (
          (date_checkin < $3 AND date_checkout > $2)  -- Solapamiento: checkin en el rango
          OR (date_checkin >= $2 AND date_checkin < $3)  -- Check-in solicitado dentro de la reserva
          OR (date_checkout > $2 AND date_checkout <= $3)  -- Check-out solicitado dentro de la reserva
        )
    `;

    const params = [
      roomIdInt,          // $1: ID de la habitación
      checkinDate, checkoutDate  // $2, $3: Fechas de checkin y checkout solicitadas
    ];

    const { rows } = await pool.query(query, params);
    const conflictCount = parseInt(rows[0].conflict_count, 10);

    // Verificar disponibilidad y mostrar mensaje en consola si está ocupada
    const isAvailable = conflictCount === 0;
    
    if (!isAvailable) {
      console.log(`La habitación ${roomIdInt} está ocupada durante las fechas solicitadas.`);
    }

    // Responder con el estado de la habitación
    return res.status(200).json({
      message: 'Room availability checked successfully',
      roomId: roomIdInt,
      isAvailable,
    });

  } catch (error) {
    console.error('Error checking room availability:', error);
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};
