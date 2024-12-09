// src/routes/users.routes.js
import express from 'express';
import { pool } from './db.js';  

const router = express.Router();

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM guests');  // Consulta para obtener todos los usuarios
    res.json(result.rows); 
  } catch (err) {
    console.error('Error en la consulta:', err.stack);
    res.status(500).send('Error en la base de datos');
  }
});


router.get('/users/:id', async (req, res) => {
  const { id } = req.params;  
  try {
    const result = await pool.query('SELECT * FROM guests WHERE id = $1', [id]); 
    if (result.rows.length > 0) {
      res.json(result.rows[0]);  
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (err) {
    console.error('Error en la consulta:', err.stack);
    res.status(500).send('Error en la base de datos');
  }
});

export default router;
