import express from 'express';
import { PORT } from './src/routes/config.js'; 
import userRouter from './src/routes/users.routes.js'; 
import reservationRouter from './src/routes/reservation.router.js'; 
import roomTypeRoutes from './src/routes/roomtype.routes.js'; 
import roomRoutes from './src/routes/room.routes.js';
import availabilityRoutes from './src/routes/availability.routes.js'; 
import staffRouter from './src/routes/staff.routes.js';
import authRoutes from './src/routes/authroutes.js';
import invoiceRoutes from './src/routes/invoice.router.js';
import paymentRoutes from './src/routes/payment.router.js';
import { authenticateAndAuthorize } from './src/middleware/authmiddleware.js'; 
import rolesRouter from './src/routes/roles.routes.js';  
import adminRoutes from './src/routes/adminroutes.js';
import dashboardRoutes from './src/routes/dashboardroutes.js';
import auditRoutes from './src/routes/auditroutes.js';
import equipmentroutes from './src/routes/equipmentroutes.js';
import specificroutes from './src/routes/specificroutes.js';



import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv'; // Importar dotenv para cargar variables de entorno

dotenv.config();

const app = express();

app.use(cors());  
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/', userRouter);
console.log("Montando las rutas de usuarios en '/api/'");


app.use('/api/reservations', reservationRouter);
console.log("Montando las rutas de reservas en '/api/reservations'");


app.use('/api/roomtypes', roomTypeRoutes);
console.log("Montando las rutas de tipos de habitaciones en '/api/roomtypes'");


app.use('/api/rooms',  roomRoutes);
console.log("Montando las rutas de habitaciones en '/api/rooms'");


app.use('/api/availability', availabilityRoutes);
console.log("Montando las rutas de disponibilidad en '/api/availability'");

// Montando las rutas de autenticación (login)
app.use('/api/auth', authRoutes);
console.log("Montando las rutas de autenticación en '/api/auth'");
// Montando las rutas de roles
app.use('/api/roles', rolesRouter); 
console.log("Montando las rutas de roles en '/api/roles'");

app.use('/api/staff', staffRouter); 
console.log("Montando las rutas de empleados en '/api/staff'");

app.use('/api/admins', adminRoutes); 
console.log("Montando las rutas de administradores en '/api/admins'");

app.use('/api/invoices', invoiceRoutes);
console.log("Montando las rutas de facturas en '/api/invoices'");

app.use('/api/payments', paymentRoutes);
console.log("Montando las rutas de pagos en '/api/payments'");

app.use('/api/dashboard', dashboardRoutes);
console.log("Montando las rutas de dashboard");

app.use('/api/audit', auditRoutes);
console.log("Montando las rutas de audit");

app.use('/api/equipment', equipmentroutes);
console.log("Montando las rutas de equipamiento en '/api/equipment'");

app.use('/api/specific', specificroutes);
console.log("Montando las rutas de specific en '/api/specific'");




app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
