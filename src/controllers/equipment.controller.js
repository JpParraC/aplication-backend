import { pool } from '../routes/db.js';

// Obtener todos los equipos de habitación
export const getRoomEquipments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM room_equipment');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Obtener un equipo de habitación por ID
export const getRoomEquipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM room_equipment WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Room equipment not found" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Crear un nuevo equipo de habitación
export const createRoomEquipment = async (req, res) => {
  const { equipment_name } = req.body;

  if (!equipment_name) {
    return res.status(400).json({ message: "Equipment name is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO room_equipment (equipment_name) VALUES ($1) RETURNING *`,
      [equipment_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Actualizar un equipo de habitación existente
export const updateRoomEquipment = async (req, res) => {
  const { id } = req.params;
  const { equipment_name } = req.body;

  if (!equipment_name) {
    return res.status(400).json({ message: "Equipment name is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE room_equipment SET equipment_name = $1 WHERE id = $2 RETURNING *`,
      [equipment_name, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Room equipment not found" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Eliminar un equipo de habitación
export const deleteRoomEquipment = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM room_equipment WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Room equipment not found" });
    } else {
      res.json({ message: "Room equipment successfully deleted" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};
