import { pool } from '../routes/db.js';

// Obtener todos los tipos de habitación
export const getRoomTypes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM room_type');
    res.json(result.rows); // Devuelve todos los tipos de habitación
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Obtener un tipo de habitación por ID
export const getRoomTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM room_type WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Devuelve el tipo de habitación encontrado
    } else {
      res.status(404).json({ message: "Room type not found" }); // Si no se encuentra el tipo de habitación
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Crear un nuevo tipo de habitación
export const createRoomType = async (req, res) => {
  const { type, capacity, price, type_bed, size, hotel_floor } = req.body;

  if (!type || !capacity || !price || !type_bed || !size || !hotel_floor) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO room_type (
        type, 
        capacity, 
        price, 
        type_bed, 
        size, 
        hotel_floor
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [type, capacity, price, type_bed, size, hotel_floor]
    );
    res.status(201).json(result.rows[0]); // Devuelve el tipo de habitación creado
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Actualizar un tipo de habitación existente
export const updateRoomType = async (req, res) => {
  const { id } = req.params;
  const { type, capacity, price, type_bed, size, hotel_floor } = req.body;

  if (!type || !capacity || !price || !type_bed || !size || !hotel_floor) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE room_type SET 
        type = $1, 
        capacity = $2, 
        price = $3, 
        type_bed = $4, 
        size = $5, 
        hotel_floor = $6
      WHERE id = $7 RETURNING *`,
      [type, capacity, price, type_bed, size, hotel_floor, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Devuelve el tipo de habitación actualizado
    } else {
      res.status(404).json({ message: "Room type not found" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Eliminar un tipo de habitación
export const deleteRoomType = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM room_type WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Room type not found" });
    } else {
      res.json({ message: "Room type successfully deleted" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};
