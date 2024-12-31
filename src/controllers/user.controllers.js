import { pool } from '../routes/db.js';  

export const getUsers =  async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM guests'); 
      res.json(result.rows); 
    } catch (err) {
      console.error('Error in query:', err.stack);
      res.status(500).send('Database error');
    }
  };
  

  export const getUserById = async (req, res) => {
    const { id } = req.params;  
    try {
      const result = await pool.query('SELECT * FROM guests WHERE id = $1', [id]); 
      if (result.rows.length > 0) {
        res.json(result.rows[0]);  
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error('Error in query:', err.stack);
      res.status(500).send('Database error');
    }
  };

  export const createUser = async (req, res) => {
    const {
      id_guest,
      first_name,
      first_lastname,
      middle_name,
      email,
      date_ofbirth,
      phone_number,
      number_persons,
      nationality
    } = req.body;
  
    // Validate input data
    if (!id_guest || !first_name || !first_lastname || !email || !date_ofbirth || !phone_number || !number_persons || !nationality) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const result = await pool.query(
        `INSERT INTO guests (
          id_guest, 
          first_name, 
          first_lastname, 
          middle_name, 
          email, 
          date_ofbirth, 
          phone_number, 
          number_persons, 
          nationality
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          id_guest,
          first_name,
          first_lastname,
          middle_name,
          email,
          date_ofbirth,
          phone_number,
          number_persons,
          nationality
        ]
      );
      res.status(201).json(result.rows[0]); // Return the newly created user
    } catch (err) {
      console.error('Error in query:', err.stack);
      res.status(500).send('Database error');
    }
  };

  export const updateUser = async (req, res) => {
    const { id } = req.params;
    const {
      id_guest,
      first_name,
      first_lastname,
      middle_name,
      email,
      date_ofbirth,
      phone_number,
      number_persons,
      nationality
    } = req.body;
  
    // Validate input data
    if (!id_guest || !first_name || !first_lastname || !email || !date_ofbirth || !phone_number || !number_persons || !nationality) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const result = await pool.query(
        `UPDATE guests SET 
          id_guest = $1,
          first_name = $2,
          first_lastname = $3,
          middle_name = $4,
          email = $5,
          date_ofbirth = $6,
          phone_number = $7,
          number_persons = $8,
          nationality = $9
        WHERE id = $10 RETURNING *`,
        [
          id_guest,
          first_name,
          first_lastname,
          middle_name,
          email,
          date_ofbirth,
          phone_number,
          number_persons,
          nationality,
          id
        ]
      );
  
      if (result.rows.length > 0) {
        res.json(result.rows[0]); // Return the updated user
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.error('Error in query:', err.stack);
      res.status(500).send('Database error');
    }
  };

  export const deleteUser = async (req, res) => {
    const { id } = req.params;  
    console.log(`ID received for deletion: ${id}`); // Debugging to check if the ID is correct
    
    try {
      // Perform user deletion
      const { rowCount } = await pool.query('DELETE FROM guests WHERE id = $1', [id]);
      console.log(`Rows affected by DELETE: ${rowCount}`); // Check how many rows were affected
  
      // If no rows were deleted, the user was not found
      if (rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      } else {
        return res.json({ message: "User successfully deleted" });
      }
    } catch (err) {
      console.error('Error in query:', err.stack);
      res.status(500).send('Database error');
    }
  };
  

  