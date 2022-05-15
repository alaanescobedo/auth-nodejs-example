import AppError from "../../error/errorApp"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../../../setup/constants"
import jwt from 'jsonwebtoken'

interface CreateJWT {
  data: any
  secret?: string
  expiresIn?: string | number | undefined
}
const create = ({ data, expiresIn = '1m' }: CreateJWT): string => {
  if (JWT_SECRET === '') throw new AppError('JWT_SECRET is not defined', 400)
  return jwt.sign({ data }, `${JWT_SECRET}`, { expiresIn })
}

const createRefresh = ({ data, expiresIn = '30d' }: CreateJWT): string => {
  if (JWT_SECRET === '') throw new AppError('JWT_SECRET is not defined', 400)
  return jwt.sign({ data }, `${JWT_REFRESH_SECRET}`, { expiresIn })
}

interface VerifyJWT {
  token: string
}
const verify = ({ token }: VerifyJWT): { id: string, exp: number } => {
  if (JWT_SECRET === '') throw new AppError('JWT_SECRET is not defined', 400)
  const tokenVerified = jwt.verify(token, JWT_SECRET)
  const { id, exp } = tokenVerified as { id: string, exp: number }
  return { id, exp }
}

export default {
  create,
  createRefresh,
  verify
}