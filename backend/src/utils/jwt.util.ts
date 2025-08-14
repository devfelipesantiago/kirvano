import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

type TokenPayload = {
  id: number,
  email: string,
};

function sign(payload: TokenPayload): string {
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
}

function verify(token: string): TokenPayload {
  if (!token) {
    throw new Error('Token é obrigatório');
  }

  try {
    const data = jwt.verify(token, secret) as TokenPayload;
    return data;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token inválido');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expirado');
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
}

export default {
  sign,
  verify,
};