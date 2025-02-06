import { pool } from '../routes/db.js';

export const getReservations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_reservations()');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};


export const getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM get_reservation_by_id($1)', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};


export const createReservation = async (req, res) => {
  const {
    date_reserve,
    date_checkin,
    date_checkout,
    number_nights,
    guests_id_guest,
    rooms,
  } = req.body;

  // Validar campos requeridos
  if (!date_reserve || !date_checkin || !date_checkout || !number_nights || !guests_id_guest || !rooms) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validar que 'rooms' sea un array no vacío
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return res.status(400).json({ message: "Rooms must be a non-empty array" });
  }

  try {
    // Llamar a la función de la base de datos para crear la reserva
    const result = await pool.query(
      `SELECT * FROM create_reservation($1, $2, $3, $4, $5, $6)`,
      [date_reserve, date_checkin, date_checkout, number_nights, guests_id_guest, rooms]
    );

    res.status(201).json({ reservationId: result.rows[0].id });
  } catch (err) {
    console.error("Error in query:", err);
    res.status(500).json({ error: "An unexpected error occurred", details: err.message });
  }
};

export const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { date_reserve, date_checkin, date_checkout, number_nights, guests_id_guest, rooms } = req.body;

  try {
      await pool.query(`CALL update_reservation($1, $2, $3, $4, $5, $6, $7)`, 
          [id, date_reserve, date_checkin, date_checkout, number_nights, guests_id_guest, rooms]);

      res.json({ message: "Reservation successfully updated" });
  } catch (err) {
      console.error("Error in query:", err);
      res.status(500).json({ error: "Database error", details: err.message });
  }
};



export const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    // Llamar a la función de la base de datos para eliminar la reserva
    await pool.query('CALL delete_reservation($1)', [id]);

    res.json({ message: "Reservation successfully deleted" });
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

