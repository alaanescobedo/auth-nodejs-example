import type { Response } from "express"
import jwt from 'jsonwebtoken'

import { JWT_REFRESH_SECRET, JWT_SECRET } from "@setup/constants"
import { UserRepository, UserEntity } from "@auth/repository"
import { AppError } from "@error"
import { Cookie, CookieService } from "./cookie.service"
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

interface SecureTokensData {
  user: Pick<UserEntity, '_id'>
  agent: string
  cookie: Cookie
  at: { expiresIn?: string, data: any }
  rt?: { expiresIn?: string, data?: any }
}
const refresh = async (res: Response, {
  user,
  agent,
  at,
  rt,
  cookie,
}: SecureTokensData) => {

  const defaultRT = { data: user._id, expiresIn: '1d' }
  const defaultAT = { data: user._id, expiresIn: '5m' }

  const { data: atData, expiresIn: atExpiresIn = '5m' } = at ?? defaultAT
  const { data: rtData, expiresIn: rtExpiresIn = '1d' } = rt ?? defaultRT

  const newAccessToken = sign({ data: atData, expiresIn: atExpiresIn })
  const newRefreshToken = sign({ data: rtData, expiresIn: rtExpiresIn, refresh: true })

  await UserRepository.create({ token: newRefreshToken, user, agent })
  const response = CookieService.create(res, { cookie, token: newRefreshToken })

  return {
    newAccessToken,
    response
  }
}

const revoke = async (res: Response, { cookie, token }: any) => {
  const response = CookieService.clear(res, { cookie })
  await UserRepository.deleteOne({ token })

  return response
}

export const TokenService = {
  verify,
  refresh,
  revoke
}