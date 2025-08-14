import { NextFunction, Request, Response } from 'express';
import jwtUtil from '../utils/jwt.util';
import UserModel from '../database/models/user.model';

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwtUtil.verify(token);
    const user = await UserModel.findByEmail(decoded.email);

    if (!user) return res.status(401).json({ message: 'Token inválido' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido aqui' });
  }
}

export default authMiddleware;