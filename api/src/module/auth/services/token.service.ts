import AppError from "../../error/errorApp"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../../../setup/constants"
import jwt from 'jsonwebtoken'

interface CreateJWT {
  data: any
  refresh?: boolean
  expiresIn?: string | number | undefined
}
const sign = ({ data, expiresIn = '1m', refresh = false }: CreateJWT): string => {
  const SECRET = refresh ? JWT_REFRESH_SECRET : JWT_SECRET
  if (SECRET === '') throw new AppError('SECRET is not defined', 400)

  return jwt.sign({ data }, `${SECRET}`, { expiresIn })
}
interface VerifyJWT {
  token: string
  refresh?: boolean
  options?: jwt.VerifyOptions
}
const verify = ({ token, refresh = false, options }: VerifyJWT) => {
  const SECRET = refresh ? JWT_REFRESH_SECRET : JWT_SECRET
  if (SECRET === '') throw new AppError('SECRET is not defined', 400)

  return jwt.verify(token, SECRET, options)
}

export default {
  sign,
  verify
}