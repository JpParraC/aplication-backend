import express from 'express';
import { PORT } from './src/routes/config.js'; 
import userRouter from './src/routes/users.routes.js'; 
import reservationRouter from './src/routes/reservation.router.js'; 
import roomTypeRoutes from './src/routes/roomtype.routes.js'; 
import roomRoutes from './src/routes/room.routes.js'; // Rutas de habitaciones
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(cors());  
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Montando las rutas de usuarios
app.use('/api/', userRouter);
console.log("Montando las rutas de usuarios en '/api/'");

// Montando las rutas de reservas
app.use('/api/reservations', reservationRouter);
console.log("Montando las rutas de reservas en '/api/reservations'");

// Montando las rutas de tipos de habitaciones
app.use('/api/roomtypes', roomTypeRoutes);
console.log("Montando las rutas de tipos de habitaciones en '/api/roomtypes'");

// Montando las rutas de habitaciones
app.use('/api/rooms', roomRoutes);
console.log("Montando las rutas de habitaciones en '/api/rooms'");

app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
