export type User = {
  id: number,
  email: string,
  password: string,
  name: string,
};

export type UserInputtableFields = Omit<User, 'password'>;
