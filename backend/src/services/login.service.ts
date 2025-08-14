import jwtUtil from '../utils/jwt.util';
import { ServiceResponse } from '../types/ServiceResponse';
import UserModel from '../database/models/user.model';
import { Login } from '../types/Login';
import bcrypt from 'bcrypt';
import { UserInputtableFields } from 'types/User';

async function verifyLogin(login: Login): Promise<ServiceResponse<UserInputtableFields & { token: string }>> {
  if (!login.email || !login.password) {
    return { status: 'INVALID_DATA', data: { message: 'Dados inválidos' } };
  }
  const foundUser = await UserModel.findByEmail(login.email);

  if (!foundUser) {
    return { status: 'UNAUTHORIZED', data: { message: 'E-mail ou senha inválidos' } };
  }

  const isPasswordValid = await bcrypt.compare(login.password, foundUser.password);
  if (!isPasswordValid) {
    return { status: 'UNAUTHORIZED', data: { message: 'E-mail ou senha inválidos' } };
  }

  const { id, email, name } = foundUser;
  const token = jwtUtil.sign({ id, email });
  return { status: 'SUCCESSFUL', data: { token, id, email, name } };
}
export default {
  verifyLogin,
};