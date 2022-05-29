import type { Request, Response } from "express"
import { UserService } from "@user"
import { EmailService } from "@notifier/email/services"
import { cryptService, TokenService } from "@auth/services"
import { AppError, catchError } from "@error"
import { UserAgentGuard } from "@auth/guards"

const resetPassword = ({
  userService = UserService(),
  tokenService = TokenService()
}) => catchError(async (req: Request, res: Response) => {
  const userAgent = UserAgentGuard(req)

  const { password } = req.body as { password: string }
  const data = req.locals.accessToken?.data

  const passwordHashed = cryptService.hash(password)
  const userUpdated = await userService.findOneAndUpdate({ id: data?.userID }, { password: passwordHashed })
  if (!userUpdated) throw new AppError('User not found', 404)

  // TODO: Repeated in a lot of tests - Refactor in a helper
  const accessTokenData = {
    username: userUpdated.username,
    roles: null
  }
  const newAccessToken = cryptService.sign({ data: accessTokenData })
  const newRefreshToken = cryptService.sign({ data: userUpdated.id, refresh: true })
  await tokenService.create({ token: newRefreshToken, user: userUpdated.id, agent: userAgent })
  res.cookie('rt', newRefreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'strict',
    secure: true
  })
  // TODO: END TODO



  await EmailService.send({
    template: 'resetPassword',
    user: userUpdated,
    token: newAccessToken
  })

  res.status(200)
  res.json({
    message: 'Reset password route',
  })
})

export { resetPassword }