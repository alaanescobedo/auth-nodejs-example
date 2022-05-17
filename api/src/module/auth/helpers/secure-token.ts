import type { Response } from "express"
import { Token } from "../services"
import cookieService, { type Cookie } from "../services/cookie.service"
import { TokenStorage } from "../storage"
import type { UserEntity } from "../storage/user.model"

interface SecureTokensData {
  user: Pick<UserEntity, '_id'>
  agent: string
  cookie: Cookie
  at: { expiresIn?: string, data: any }
  rt?: { expiresIn?: string, data?: any }
}

// TODO: This grew, find a way to refactor
const secureTokens = async (res: Response, {
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

  const newAccessToken = Token.sign({ data: atData, expiresIn: atExpiresIn })
  const newRefreshToken = Token.sign({ data: rtData, expiresIn: rtExpiresIn, refresh: true })
  await TokenStorage.store({ token: newRefreshToken, user, agent })
  const response = cookieService.create(res, { cookie, token: newRefreshToken })

  return {
    newAccessToken,
    response
  }
}

const revokeTokens = async (res: Response, { cookie, token }: any) => {
  const response = cookieService.clear(res, { cookie })
  await TokenStorage.destroy({ token })

  return {
    response
  }
}

export {
  secureTokens,
  revokeTokens
}