import type { Request, Response } from "express"
import type { LoginUserClientData } from "@common/auth/interfaces"
import { UserService } from "@user"
import { AppError, catchError } from "@error"
import { UserAgentGuard } from "@auth/guards"
import { cryptService, TokenService } from "@auth/services"

type ConnectTokenMethods =
  | 'findOne'
  | 'revoke'
  | 'revokeAll'
  | 'revoke'
  | 'create'
type ConnectUserMethods = 'findOne'
interface ConnectParams {
  tokenService: Pick<ReturnType<typeof TokenService>, ConnectTokenMethods>
  userService: Pick<ReturnType<typeof UserService>, ConnectUserMethods>
}

const connect = ({
  tokenService = TokenService(),
  userService = UserService()
}: ConnectParams) => catchError(async (req: Request, res: Response) => {

  const { email, password } = req.body as LoginUserClientData
  const { rt: refreshToken } = req.cookies

  const userAgent = UserAgentGuard(req)

  const user = await userService.findOne({ email })
  if (!user) throw new AppError('User not found', 404)

  const match = await cryptService.compare(password, user.password)
  console.log({ match })
  if (!match) throw new AppError('Invalid credentials', 401)

  if (!refreshToken) {
    const deviceInUse = await tokenService.findOne({ user: user.id, agent: userAgent })
    if (deviceInUse) await tokenService.revoke({ token: deviceInUse.token })
  }

  const tokenData = await tokenService.findOne({ token: refreshToken })
  if (tokenData === null) { // Possibly the token has been stolen
    await tokenService.revokeAll({ user: user.id })
    throw new AppError('Invalid refresh token', 401)
  }

  await tokenService.revoke({ name: 'rt', value: refreshToken })

  const accessTokenData = {
    username: user.username,
    roles: null
  }
  const newAccessToken = cryptService.sign({ data: accessTokenData })
  const newRefreshToken = cryptService.sign({ data: user.id, refresh: true })
  await tokenService.create({ token: newRefreshToken, user: user.id, agent: userAgent })
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

export { connect }