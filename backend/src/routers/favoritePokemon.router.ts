import { Router } from 'express';
import favoritePokemonController from '../controllers/favoritePokemon.controller';
import authMiddleware from '../middlewares/auth.middleware';

const favoritePokemonRouter = Router();

favoritePokemonRouter.use(authMiddleware);

favoritePokemonRouter.post('/', favoritePokemonController.addFavorite);
favoritePokemonRouter.get('/', favoritePokemonController.getFavorites);

export default favoritePokemonRouter;