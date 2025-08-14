import { Request, Response } from 'express';
import favoritePokemonService from '../services/favoritePokemon.service';

async function addFavorite(req: Request, res: Response) {
  const { pokemonName } = req.body;
  const id = req.user.id

  const serviceResponse = await favoritePokemonService.addFavorite(id, pokemonName);
  if (serviceResponse.status !== 'SUCCESSFUL') {
    return res.status(409).json(serviceResponse.data);
  }
  res.status(201).json(serviceResponse.data);
}

async function getFavorites(req: Request, res: Response) {
  const id = req.user.id
  const serviceResponse = await favoritePokemonService.getFavorites(id);
  if (serviceResponse.status !== 'SUCCESSFUL') {
    return res.status(404).json(serviceResponse.data);
  }
  res.status(200).json(serviceResponse.data);
}

export default {
  addFavorite,
  getFavorites,
};