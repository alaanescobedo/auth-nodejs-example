import type { Request, Response } from "express"
import { TokenStorage } from "../storage"
import type { UserEntity } from "../storage/user.model"
import { Token } from "../utils"

interface secureTokensData {
  atData: any
  user: Pick<UserEntity, '_id'>
}
const secureTokens = async (request: Request, response: Response, { atData, user }: secureTokensData) => {
  const newAccessToken = Token.create({ data: atData })
  const refreshToken = Token.create({ data: user, refresh: true, expiresIn: '1d' })
  await TokenStorage.store({ token: refreshToken, user })
  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: request.secure || request.headers['x-forwarded-proto'] === 'https'
  })

  return {
    newAccessToken,
    response
  }
}

export {
  secureTokens
}