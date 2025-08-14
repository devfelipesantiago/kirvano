import userModel from '../database/models/user.model';
import FavoritePokemonModel from '../database/models/favoritePokemon.model';
import { ServiceResponse } from '../types/ServiceResponse';

const addFavorite = async (id: number, pokemonName: string): Promise<ServiceResponse<number>> => {
  const userId = await userModel.findById(id);
  if (!userId) {
    return { status: 'NOT_FOUND', data: { message: `Usuário não encontrado.` } };
  }

  try {
    const favoriteId = await FavoritePokemonModel.add(id, pokemonName);
    return { status: 'SUCCESSFUL', data: id };

  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && typeof (error as any).code === 'string') {
      if ((error as any).code === 'ER_DUP_ENTRY') {
        return { status: 'INVALID_DATA', data: { message: 'Este Pokémon já é favorito deste usuário.' } };
      }
    }
    return { status: 'INVALID_DATA', data: { message: `Erro ao adicionar favorito.` } };
  }
};

const getFavorites = async (id: number): Promise<ServiceResponse<string[]>> => {
  const userId = await userModel.findById(id);
  if (!userId) {
    return { status: 'NOT_FOUND', data: { message: `Usuário não encontrado.` } };
  }

  const favorites = await FavoritePokemonModel.getAll(id);
  return { status: 'SUCCESSFUL', data: favorites };
};

export default {
  addFavorite,
  getFavorites,
};