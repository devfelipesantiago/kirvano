import bcrypt from 'bcrypt';
import UserModel, { UserSequelizeModel } from '../database/models/user.model';
import { ServiceResponse } from '../types/ServiceResponse';
import { Token } from '../types/Token';
import { User, UserInputtableFields } from '../types/User';
import jwtUtil from '../utils/jwt.util';

async function registerUser(
  user: UserInputtableFields,
): Promise<ServiceResponse<Token>> {
  if (!user.email || !user.password || !user.name) {
    return { status: 'INVALID_DATA', data: { message: 'Dados inválidos' } };
  }

  const existingUser = await UserModel.findOne({ where: { email: user.email } });
  if (existingUser) {
    return { status: 'INVALID_DATA', data: { message: 'Este e-mail já está em uso.' } };
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = { ...user, password: hashedPassword };

  const createdUser = await UserModel.create(newUser);

  const { id, email } = createdUser.dataValues;
  const token = jwtUtil.sign({ id, email });

  return { status: 'SUCCESSFUL', data: { token } };
}

async function getProfiles(): Promise<ServiceResponse<User[]>> {
  const profiles = await UserModel.findAll();
  if (!profiles) {
    return { status: 'INVALID_DATA', data: { message: 'Nenhum perfil encontrado' } };
  }

  const profilesWithoutPassword = profiles.map((profile) => {
    const { password, ...profileWithoutPassword } = profile.dataValues;
    return profileWithoutPassword as User;
  });

  return { status: 'SUCCESSFUL', data: profilesWithoutPassword };
}

export default {
  registerUser,
  getProfiles,
};