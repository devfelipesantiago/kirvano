import { User } from '../../../types/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}