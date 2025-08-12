import express, { Request, Response } from 'express';
//import profilesRouter from './routers/profiles.router';
import loginRouter from './routers/login.router';
import authMiddleware from './middlewares/auth.middleware';

const app = express();

app.use(express.json());
app.use(loginRouter);
app.use(authMiddleware);
//app.use(profilesRouter);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Aplicação está funcionando!');
});

export default app;