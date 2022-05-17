import type { Request, Response } from "express"
import type { LoginUserClientData } from "../../../../../common/src/modules/auth/interfaces/login.interface"
import { db } from "../../../setup/config"
import AppError from "../../error/errorApp"
import { catchError } from "../../error/utils"
import { secureTokens } from "../helpers/secure-token"
import { Encrypt } from "../services"
import cookieService from "../services/cookie.service"
import { AuthStorage, TokenStorage } from "../storage"

const connect = catchError(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginUserClientData
  const { rt: refreshToken } = req.cookies

  // TODO MIDDLEWARE: Validate user agent
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)
  // TODO: END TODO

  db.connect()
  const user = await AuthStorage.findUserByEmail({ email })
  if (user === null) throw new AppError('User not found', 404)

  const match = Encrypt.compare(password, user.password)
  if (!match) throw new AppError('Password is not valid', 401)

  if (refreshToken) {
    const tokenData = await TokenStorage.findOne({ token: refreshToken })

    if (tokenData === null) {
      // Possibly the token has been stolen
      // Clear all refresh tokens for this user
      await TokenStorage.destroyAll({ user: user._id })
      throw new AppError('No Content - Refresh token not found', 400)
    }

    await TokenStorage.destroy({ token: refreshToken })
    res = cookieService.clear(res, { cookie: 'rt' })
  }
  if (!refreshToken) {
    const tokenOfUserAgent = await TokenStorage.findOne({ user: user._id, agent: userAgent })
    if (tokenOfUserAgent) await TokenStorage.destroy({ token: tokenOfUserAgent.token })
  }

  // TODO: Duplicate code - move to a helper
  const atData = {
    username: user.username,
    roles: null
  }
  // TODO: END TODO

  const { newAccessToken, response } = await secureTokens(res, {
    at: { data: atData },
    user: user._id,
    agent: userAgent,
    cookie: 'rt'
  })

  db.disconnect()

  // Send Response
  response.status(200).json({
    status: 'success',
    token: newAccessToken
  })
})

export { connect }