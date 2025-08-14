import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import connection from '../config/database';

const add = async (userId: number, pokemonName: string) => {
  const [ result ] = await connection.execute<ResultSetHeader>(
    'INSERT INTO favorite_pokemons (user_id, pokemon_name) VALUES (?, ?)',
    [ userId, pokemonName ]
  );
  return result.insertId;
};

const remove = async (userId: number, pokemonName: string) => {
  const [ result ] = await connection.execute<ResultSetHeader>(
    'DELETE FROM favorite_pokemons WHERE user_id = ? AND pokemon_name = ?',
    [ userId, pokemonName ]
  );
  return result.affectedRows;
};

const getAll = async (userId: number): Promise<string[]> => {
  const [ rows ] = await connection.execute<RowDataPacket[]>(
    'SELECT pokemon_name FROM favorite_pokemons WHERE user_id = ?',
    [ userId ]
  );
  return rows.map((row) => row.pokemon_name);
};

export default {
  add,
  remove,
  getAll,
};