import pg from 'pg';  
const { Pool } = pg;  

import { dbConfig } from './config.js';  

const pool = new Pool(dbConfig);


export { pool };
