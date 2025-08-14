import mysql from 'mysql2/promise';

const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_HOST = process.env.DB_HOST || 'db';
const DB_NAME = process.env.DB_NAME || 'profile_db';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const connection = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default connection;