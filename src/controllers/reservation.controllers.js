import { pool } from '../routes/db.js';

// Obtener todas las reservas
export const getReservations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservation');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Obtener una reserva por ID
export const getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM reservation WHERE id = $1', [id]);
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

// Crear una nueva reserva
export const createReservation = async (req, res) => {
  console.log("Request Body:", req.body); // Verifica qué datos está recibiendo el backend

  const {
    date_reserve,
    date_checkin,
    date_checkout,
    number_nights,
    guests_id_guest, // Ahora hacemos referencia a 'guests'
    rooms, // Array de enteros
  } = req.body;

  // Validar campos requeridos
  if (!date_reserve || !date_checkin || !date_checkout || !number_nights || !guests_id_guest || !rooms) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validar que 'rooms' sea un array no vacío y de enteros
  if (!Array.isArray(rooms) || rooms.length === 0 || !rooms.every(room => Number.isInteger(room))) {
    return res.status(400).json({ message: "Rooms must be a non-empty array of integers" });
  }

  try {
    // Verificar si el huésped existe
    const guestResult = await pool.query(
      `SELECT * FROM guests WHERE id_guest = $1`,
      [guests_id_guest]
    );

    if (guestResult.rows.length === 0) {
      return res.status(404).json({ message: "Guest not found. Please register the guest first." });
    }

    // Insertar la nueva reserva
    const result = await pool.query(
      `INSERT INTO reservation (
        date_reserve, 
        date_checkin, 
        date_checkout, 
        number_nights, 
        guests_id_guest, 
        rooms, 
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
      [date_reserve, date_checkin, date_checkout, number_nights, guests_id_guest, rooms]
    );

    // Respuesta exitosa
    res.status(201).json({ reservationId: result.rows[0].id });
  } catch (err) {
    console.error("Error in query:", err);
    res.status(500).json({ error: "An unexpected error occurred", details: err.message });
  }
};

// Actualizar una reserva existente
export const updateReservation = async (req, res) => {
  const { id } = req.params;
  const {
    date_reserve,
    date_checkin,
    date_checkout,
    number_nights,
    guests_id_guest,
  } = req.body;

  if (!date_reserve || !date_checkin || !date_checkout || !number_nights || !guests_id_guest) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE reservation SET 
        date_reserve = $1,
        date_checkin = $2,
        date_checkout = $3,
        number_nights = $4,
        guests_id_guest = $5,
        updated_at = NOW()
      WHERE id = $6 RETURNING *`,
      [date_reserve, date_checkin, date_checkout, number_nights, guests_id_guest, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Retorna la reserva actualizada
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Eliminar una reserva
export const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM reservation WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    } else {
      res.json({ message: "Reservation successfully deleted" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};
