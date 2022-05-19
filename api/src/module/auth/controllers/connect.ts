import type { Request, Response } from "express"
import type { LoginUserClientData } from "../../../../../common/src/modules/auth/interfaces/login.interface"
import { db } from "../../../setup/config"
import AppError from "../../error/errorApp"
import { catchError } from "../../error/utils"
import { EncryptService, TokenService } from "@auth/services"
import { TokenRepository, UserRepository } from "@auth/repository"

const connect = catchError(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginUserClientData
  const { rt: refreshToken } = req.cookies

  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)

  db.connect()
  const user = await UserRepository.findOne({ email })
  if (user === null) throw new AppError('User not found', 404)

  const match = EncryptService.compare(password, user.password)
  if (!match) throw new AppError('Password is not valid', 401)

  if (refreshToken) {
    const tokenData = await TokenRepository.findOne({ token: refreshToken })

    if (tokenData === null) {
      // Possibly the token has been stolen
      await TokenRepository.deleteMany({ user: user._id })
      throw new AppError('No Content - Refresh token not found', 400)
    }

    res = await TokenService.revoke(res, { cookie: 'rt', token: refreshToken })
  }
  if (!refreshToken) {
    // Clear previous session
    const tokenOfUserAgent = await TokenRepository.findOne({ user: user._id, agent: userAgent })
    if (tokenOfUserAgent) await TokenRepository.deleteOne({ token: tokenOfUserAgent.token })
  }

  const atData = {
    username: user.username,
    roles: null
  }

  const { newAccessToken, response } = await TokenService.refresh(res, {
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