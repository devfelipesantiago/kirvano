import express, { Request, Response } from 'express';
import userRouter from './routers/user.router';
import loginRouter from './routers/login.router';

const app = express();

app.use(express.json());
app.use(loginRouter);
app.use('/users', userRouter);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Aplicação está funcionando!');
});

export default app;