import { pool } from '../routes/db.js';

// Obtener todas las habitaciones
export const getRooms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms');
    res.json(result.rows); // Devuelve todas las habitaciones
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Obtener una habitación por ID
export const getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Devuelve la habitación encontrada
    } else {
      res.status(404).json({ message: "Room not found" }); // Si no se encuentra la habitación
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Crear una nueva habitación
export const createRoom = async (req, res) => {
  const { status, room_type_id } = req.body;

  if (!status || !room_type_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Insertar nueva habitación
    const result = await pool.query(
      `INSERT INTO rooms (status, room_type_id) 
      VALUES ($1, $2) RETURNING *`,
      [status, room_type_id]
    );
    res.status(201).json(result.rows[0]); // Devuelve la habitación creada
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Actualizar una habitación existente
export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { status, room_type_id } = req.body;

  if (!status || !room_type_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Actualizar los datos de la habitación
    const result = await pool.query(
      `UPDATE rooms SET 
        status = $1, 
        room_type_id = $2 
      WHERE id = $3 RETURNING *`,
      [status, room_type_id, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Devuelve la habitación actualizada
    } else {
      res.status(404).json({ message: "Room not found" }); // Si no encuentra la habitación
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Eliminar una habitación
export const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM rooms WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Room not found" }); // Si no encuentra la habitación
    } else {
      res.json({ message: "Room successfully deleted" }); // Habitación eliminada
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};
