// src/services/login.service.ts
import jwtUtil from '../utils/jwt.util';
import { ServiceResponse } from '../types/ServiceResponse';
import UserModel from '../database/models/user.model';
import { Token } from '../types/Token';
import { Login } from '../types/Login';
import bcrypt from 'bcrypt'; // Importamos o bcrypt

async function verifyLogin(login: Login): Promise<ServiceResponse<Token>> {
  if (!login.email || !login.password) {
    return { status: 'INVALID_DATA', data: { message: 'Dados inválidos' } };
  }
  const foundUser = await UserModel.findOne({ where: { email: login.email } });

  // 1. Verificação do usuário
  if (!foundUser) {
    return { status: 'UNAUTHORIZED', data: { message: 'E-mail ou senha inválidos' } };
  }

  // 2. Compara a senha enviada com a senha criptografada no banco
  const isPasswordValid = await bcrypt.compare(login.password, foundUser.dataValues.password);

  if (!isPasswordValid) {
    return { status: 'UNAUTHORIZED', data: { message: 'E-mail ou senha inválidos' } };
  }

  // 3. Se a senha for válida, gera o token
  const { id, email } = foundUser.dataValues;
  const token = jwtUtil.sign({ id, email });
  return { status: 'SUCCESSFUL', data: { token } };
}
export default {
  verifyLogin,
};