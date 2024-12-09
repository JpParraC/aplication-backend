import express from 'express';
import { PORT } from './src/routes/config.js'; 
import router from './src/routes/users.routes.js'; 
const app = express();

// Usar el middleware para manejar datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


console.log("Montando las rutas de usuarios...");
app.use('/api', router);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
