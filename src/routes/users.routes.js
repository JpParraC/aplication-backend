// src/routes/users.routes.js
import express from 'express';
import { getUsers } from '../controllers/user.controllers.js';
import { getUserById } from '../controllers/user.controllers.js';
import { createUser } from '../controllers/user.controllers.js';
import { updateUser } from '../controllers/user.controllers.js';
import { deleteUser } from '../controllers/user.controllers.js';





const router = express.Router();
//obtener clientes
router.get('/users', getUsers);
// obtener por id
router.get('/users/:id', getUserById);

//agregar cliente
router.post('/users',  createUser);

// modificar
router.put('/users/:id', updateUser );

//eliminar
router.delete('/users/:id', deleteUser);

export default router;