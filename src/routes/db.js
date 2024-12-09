import pg from 'pg';  // Importa el paquete pg
const { Pool } = pg;  // Extrae Pool del paquete

import { dbConfig } from './config.js';  // Importa la configuración de la base de datos

// Crea una instancia de Pool con la configuración de la base de datos
const pool = new Pool(dbConfig);

// Exporta el objeto pool para que pueda ser utilizado en otros archivos
export { pool };
