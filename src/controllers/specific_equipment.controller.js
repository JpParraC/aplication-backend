import { pool } from '../routes/db.js';

// Obtener todos los equipos específicos de habitación
export const getRoomSpecificEquipments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM room_specific_equipment');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Obtener un equipo específico de habitación por ID
export const getRoomSpecificEquipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM room_specific_equipment WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Room specific equipment not found" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Crear un nuevo equipo específico de habitación
export const createRoomSpecificEquipment = async (req, res) => {
  const { room_id, equipment_id, type_room } = req.body;

  if (!room_id || !equipment_id ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
   const roomResult = await pool.query(
     `SELECT rooms_type_id FROM rooms WHERE id = $1`, 
      [room_id]
    );
    const type_room = roomResult.rows[0]?.type_room; // Suponiendo que `rooms` tiene el campo `type_room`

    // Luego, insertar en la tabla `room_specific_equipment`
    const result = await pool.query(
      `INSERT INTO room_specific_equipment (room_id, equipment_id, type_room) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [room_id, equipment_id, type_room]  // Asegúrate de que `type_room` está disponible aquí
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Actualizar un equipo específico de habitación existente
export const updateRoomSpecificEquipment = async (req, res) => {
  const { id } = req.params;
  const { room_id, equipment_id, type_room } = req.body;

  if (!room_id || !equipment_id || !type_room) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE room_specific_equipment SET room_id = $1, equipment_id = $2, type_room = $3 WHERE id = $4 RETURNING *`,
      [room_id, equipment_id, type_room, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Room specific equipment not found" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Eliminar un equipo específico de habitación
export const deleteRoomSpecificEquipment = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM room_specific_equipment WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Room specific equipment not found" });
    } else {
      res.json({ message: "Room specific equipment successfully deleted" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};
