import pg from 'pg';  
import {DB_DATABASE} from './config.js'
import {DB_PASSWORD} from './config.js'
import {DB_PORT} from './config.js'
import {DB_USER} from './config.js'
import {DB_HOST} from './config.js'



export const pool = new pg.Pool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
  });
