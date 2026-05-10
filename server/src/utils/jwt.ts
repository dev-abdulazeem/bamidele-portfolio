import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default_secret';

export const generateToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};