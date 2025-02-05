// controllers/staffController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los empleados (INNER JOIN con rol_staff)
export const getStaff = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT staff.*, rol_staff.rol_staffname
      FROM staff 
      INNER JOIN rol_staff ON staff.rol_id = rol_staff.id
      ORDER BY staff.id_staff ASC
    `;
    res.json(result);
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Obtener un empleado por su ID (INNER JOIN con rol_staff)
export const getStaffById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await prisma.$queryRaw`
      SELECT staff.*,  rol_staff.rol_staffname
      FROM staff 
      INNER JOIN rol_staff ON staff.rol_id = rol_staff.id
      WHERE staff.id_staff = ${id}
    `;

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send('Staff not found');
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Crear un nuevo empleado
export const createStaff = async (req, res) => {
  const { id_staff, name_staff, lastname_staff, email_staff, phone, rol_id } = req.body;

  if (!id_staff || !name_staff || !lastname_staff || !email_staff || !phone || !rol_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await prisma.$queryRaw`
      INSERT INTO staff (id_staff, name_staff, lastname_staff, email_staff, phone, rol_id)
      VALUES (${id_staff}, ${name_staff}, ${lastname_staff}, ${email_staff}, ${phone}, ${rol_id})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Actualizar un empleado
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { id_staff, name_staff, lastname_staff, email_staff, phone, rol_id , gen} = req.body;

  
  try {
    const result = await prisma.$queryRaw`
      UPDATE staff SET 
        id_staff = ${id_staff}, 
        name_staff = ${name_staff}, 
        lastname_staff = ${lastname_staff}, 
        email_staff = ${email_staff}, 
        phone = ${phone}, 
        rol_id = ${rol_id},
        gen = ${gen}
      WHERE id_staff = ${id}
      RETURNING *
    `;

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: "Staff not found" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

// Eliminar un empleado
export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await prisma.$queryRaw`
      DELETE FROM staff WHERE id_staff = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    } else {
      return res.json({ message: "Staff successfully deleted" });
    }
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};

export const getStaffLeftJoin = async (req, res) => {
  try {
    console.log("🔍 Ejecutando LEFT JOIN..."); // Depuración
    const result = await prisma.$queryRaw`
      SELECT staff.*, rol_staff.rol_staffname
      FROM staff 
      LEFT JOIN rol_staff ON staff.rol_id = rol_staff.id
    `;
    console.log("✅ Resultado:", result); // Ver qué devuelve la consulta
    res.json(result);
  } catch (err) {
    console.error('❌ Error en la consulta:', err.stack);
    res.status(500).send('Database error');
  }
};


// Obtener todos los roles con empleados (RIGHT JOIN)
export const getStaffRightJoin = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT rol_staff.*, staff.name_staff 
      FROM rol_staff 
      RIGHT JOIN staff ON staff.rol_id = rol_staff.id
    `;
    res.json(result);
  } catch (err) {
    console.error('Error in query:', err.stack);
    res.status(500).send('Database error');
  }
};
