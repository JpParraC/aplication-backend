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

export const createRoomSpecificEquipment = async (req, res) => {
  const { room_id } = req.params; // Obtener el room_id de la URL
  const { equipment_ids, room_type_id } = req.body; // Ahora recibe room_type_id desde el frontend

  if (!room_id || !equipment_ids || equipment_ids.length === 0 || !room_type_id) {
    return res.status(400).json({ message: "Room ID, room type ID, and equipment IDs are required" });
  }

  try {
    // Insertar los equipos en la base de datos
    const insertPromises = equipment_ids.map(async (equipment_id) => {
      return pool.query(
        `INSERT INTO room_specific_equipment (room_id, equipment_id, type_room) 
         VALUES ($1, $2, $3) RETURNING *`,
        [room_id, equipment_id, room_type_id] // Ahora usa el room_type_id recibido
      );
    });

    // Ejecutar todas las inserciones en paralelo
    await Promise.all(insertPromises);

    res.status(201).json({ message: "Equipment added successfully" });
  } catch (err) {
    console.error("Error in query:", err.stack);
    res.status(500).send("Database error");
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
export const getEquipmentsByRoomId = async (req, res) => {
  const { room_id } = req.params;

  if (!room_id) {
    return res.status(400).json({ message: "room_id is required" });
  }

  try {
    const result = await pool.query(
      `SELECT rse.equipment_id, eq.equipment_name
       FROM room_specific_equipment rse
       JOIN room_equipment eq ON rse.equipment_id = eq.id
       WHERE rse.room_id = $1`,
      [room_id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "No equipment found for this room" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Obtener todos los equipos agrupados por room_id
export const getAllEquipmentGroupedByRoom = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT rse.room_id,
              STRING_AGG(re.equipment_name, ', ' ORDER BY rse.equipment_id) AS equipment_names
       FROM room_specific_equipment rse
       JOIN room_equipment re ON re.id = rse.equipment_id
       GROUP BY rse.room_id`
    );

    if (result.rows.length > 0) {
      res.json(result.rows); // Devolvemos todos los resultados
    } else {
      res.status(404).json({ message: "No equipment found for any room" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};
