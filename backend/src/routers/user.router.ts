import { Router } from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.get('/profiles', authMiddleware, userController.getProfiles);

export default userRouter;