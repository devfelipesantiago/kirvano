import { RowDataPacket } from 'mysql2/promise';
import connection from '../config/database';
import { User } from '../../types/User';

const findByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] as User || null;
};

const findById = async (id: number): Promise<User | null> => {
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0] as User || null;
};

const create = async (name: string, email: string, password_hash: string) => {
  const [result] = await connection.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password_hash]
  );
  return (result as any).insertId as number;
};

const findAll = async (): Promise<User[]> => {
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT id, name, email FROM users'
  );
  return rows as User[];
};

export default {
  findByEmail,
  findById,
  create,
  findAll,
};