import express from 'express';
import { PORT } from './src/routes/config.js'; 
import userRouter from './src/routes/users.routes.js'; 
import reservationRouter from './src/routes/reservation.router.js'; 
import roomTypeRoutes from './src/routes/roomtype.routes.js'; 
import roomRoutes from './src/routes/room.routes.js';
import availabilityRoutes from './src/routes/availability.routes.js'; 
import staffRouter from './src/routes/staff.routes.js';
import authRoutes from './src/routes/authroutes.js';
import { authenticateAndAuthorize } from './src/middleware/authmiddleware.js'; 
import rolesRouter from './src/routes/roles.routes.js';  
import adminRoutes from './src/routes/adminroutes.js';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv'; // Importar dotenv para cargar variables de entorno

dotenv.config();

const app = express();

app.use(cors());  
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Montando las rutas de usuarios (no requiere autenticación, pero podría si fuera necesario)
app.use('/api/', userRouter);
console.log("Montando las rutas de usuarios en '/api/'");

// Montando las rutas de reservas, protegida con permiso 'manage_reservations'
app.use('/api/reservations', reservationRouter);
console.log("Montando las rutas de reservas en '/api/reservations'");

// Montando las rutas de tipos de habitaciones, protegida con permiso 'view_roomtypes'
app.use('/api/roomtypes', roomTypeRoutes);
console.log("Montando las rutas de tipos de habitaciones en '/api/roomtypes'");

// Montando las rutas de habitaciones, protegida con permiso 'view_rooms'
app.use('/api/rooms',  roomRoutes);
console.log("Montando las rutas de habitaciones en '/api/rooms'");

// Montando las rutas de disponibilidad, protegida con permiso 'view_availability'
app.use('/api/availability', availabilityRoutes);
console.log("Montando las rutas de disponibilidad en '/api/availability'");

// Montando las rutas de autenticación (login), no requiere autorización, solo autenticación
app.use('/api/auth', authRoutes);
console.log("Montando las rutas de autenticación en '/api/auth'");
// Montando las rutas de roles
app.use('/api/roles', rolesRouter); // Aquí agregamos las rutas de roles
console.log("Montando las rutas de roles en '/api/roles'");

app.use('/api/staff', staffRouter); 
console.log("Montando las rutas de empleados en '/api/staff'");

app.use('/api/admins', adminRoutes); 
console.log("Montando las rutas de administradores en '/api/admins'");


app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
