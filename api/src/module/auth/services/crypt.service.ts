import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import { AppError } from '@error';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '@setup/constants';
import type { ICryptService, SignJWT, VerifyJWT } from './interfaces';

// Encrypt
const hash = (item: string, rounds: number = 12): string => {
  const salt = bcrypt.genSaltSync(rounds)
  return bcrypt.hashSync(item, salt)
}
const compare = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  const res = await bcrypt.compare(plainPassword, hashedPassword)
  return res
}
// Sign
const sign = ({ data, refresh = false, options }: SignJWT): string => {
  const secret = getJWTSecret(refresh)
  return jwt.sign({ data }, `${secret}`, {
    expiresIn: options?.expiresIn ?? refresh ? '8h' : '5m',
    ...options
  })
}
const verify = ({ token, refresh = false, options }: VerifyJWT): any => {
  const secret = getJWTSecret(refresh)
  const res = jwt.verify(token, secret, options)
  return res
}

// Helpers
function getJWTSecret(isRefreshToken: boolean): string {
  const SECRET = isRefreshToken ? JWT_REFRESH_SECRET : JWT_SECRET
  if (SECRET === '') throw new AppError('SECRET is not defined', 400)
  return SECRET
}


export const cryptService: ICryptService = {
  hash,
  compare,
  verify,
  sign
}
