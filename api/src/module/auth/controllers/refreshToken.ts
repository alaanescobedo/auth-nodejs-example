import type { Request, Response } from "express"
import { UserService } from "@user"
import { TokenService, cryptService } from "@auth/services"
import { AppError, catchError } from "@error"
import { CookieGuard } from "@auth/guards"

const refreshToken = ({
  userService = UserService(),
  tokenService = TokenService(),
}) => catchError(async (req: Request, res: Response) => {
  const refreshToken = CookieGuard(req.cookies.rt)

  res.clearCookie('rt', {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'strict',
    secure: true
  })
  const tokenData = await tokenService.findOne({ token: refreshToken })
  if (tokenData === null) {
    const decoded = cryptService.verify({ token: refreshToken, refresh: true }) as { data: string }
    // The token does not belong to any user - Possibly invented token
    if (decoded === null) throw new AppError('No Content', 404)
    // Possibly the token has been stolen - Clear all refresh tokens for this user
    // User also should clear cookies in client
    const userHacked = await userService.findById({ id: decoded.data })
    if (userHacked) await tokenService.revokeAll({ user: userHacked.id })

    throw new AppError('No Content', 404)
  }

  const { user, agent } = tokenData
  await tokenService.revoke({ token: refreshToken })

  // TODO: Rewrite db and save username to no need to find user again
  const userFounded = await userService.findById({ id: user as unknown as string })
  if (!userFounded) throw new AppError('User not found', 404)



  const accessTokenData = {
    username: userFounded.username,
    roles: null
  }
  const newAccessToken = cryptService.sign({ data: accessTokenData })
  const newRefreshToken = cryptService.sign({ data: user, refresh: true })
  await tokenService.create({ token: newRefreshToken, user, agent })
  res.cookie('rt', newRefreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'strict',
    secure: true
  })



  res.status(200)
  res.json({
    status: 'success',
    token: newAccessToken,
  })
})

export { refreshToken }