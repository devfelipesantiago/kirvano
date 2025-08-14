import bcrypt from 'bcrypt';
import UserModel from '../database/models/user.model';
import { ServiceResponse } from '../types/ServiceResponse';
import { UserInputtableFields, User } from '../types/User';

async function registerUser(user: User): Promise<ServiceResponse<UserInputtableFields>> {
  if (!user.email || !user.password || !user.name) {
    return { status: 'INVALID_DATA', data: { message: 'Dados inválidos' } };
  }

  const existingUser = await UserModel.findByEmail(user.email);
  if (existingUser) {
    return { status: 'INVALID_DATA', data: { message: 'Este e-mail já está em uso.' } };
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUserId = await UserModel.create(user.name, user.email, hashedPassword);

  return { status: 'SUCCESSFUL', data: { id: newUserId, email: user.email, name: user.name } };
}

async function getProfiles(): Promise<ServiceResponse<User[]>> {
  const profiles = await UserModel.findAll();

  if (!profiles || profiles.length === 0) {
    return { status: 'INVALID_DATA', data: { message: 'Nenhum perfil encontrado' } };
  }
  return { status: 'SUCCESSFUL', data: profiles };
}

export default {
  registerUser,
  getProfiles,
};