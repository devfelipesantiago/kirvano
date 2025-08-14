import express, { Request, Response } from 'express';
import cors from 'cors';
import userRouter from './routers/user.router';
import loginRouter from './routers/login.router';
import favoritePokemonRouter from './routers/favoritePokemon.router';

const app = express();

app.use(express.json());
app.use(cors());
app.use(loginRouter);
app.use('/users', userRouter);
app.use('/favorites', favoritePokemonRouter);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Aplicação está funcionando!');
});

export default app;