import type { Request, Response } from "express"
import { UserService } from "@user/services"
import { TokenService, CookieService } from "@auth/services"
import { TokenRepository } from "@auth/repository"
import { AppError, catchError } from "@error"

const refreshToken = catchError(async (req: Request, res: Response) => {
  const { rt: refreshToken } = req.cookies
  if (refreshToken === undefined) throw new AppError('No refresh token', 401)

  res = CookieService.clear(res, { cookie: 'rt' })

  const tokenData = await TokenRepository.findOne({ token: refreshToken })
  // ?DEBUG console.log({ tokenData })
  if (tokenData === null) {
    const decoded = TokenService.verify({ token: refreshToken, refresh: true }) as { data: string }
    // The token does not belong to any user
    //  Possibly invented token
    if (decoded === null) throw new AppError('No Content', 404)
    // ?DEBUG console.log({ decoded })
    // Possibly the token has been stolen
    // Clear all refresh tokens for this user
    // User also should clear cookies in client
    const userHacked = await UserService.findById({ id: decoded.data })
    if (userHacked) await TokenRepository.deleteMany({ user: userHacked._id })

    throw new AppError('No Content', 404)
  }
  const { user } = tokenData
  await TokenRepository.deleteOne({ token: refreshToken })

  const atData = {
    id: user._id,
    roles: null
  }

  const { newAccessToken, response } = await TokenService.refresh(res, {
    at: { data: atData },
    user: user._id,
    agent: tokenData.agent,
    cookie: 'rt'
  })

  response.status(200).json({
    status: 'success',
    token: newAccessToken,
  })
})

export { refreshToken }