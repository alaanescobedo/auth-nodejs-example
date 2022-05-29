import type { Request, Response } from "express"
import { cryptService, TokenService } from "@auth/services"
import { UserService } from "@user"
import { EmailService } from "@notifier/email/services"
import { AppError, catchError } from "@error"
import { UserAgentGuard } from "@auth/guards"

const forgotPassword = ({
  userService = UserService(),
  tokenService = TokenService()
}) => catchError(async (req: Request, res: Response) => {

  const userAgent = UserAgentGuard(req)

  const { email } = req.body as { email: string }

  const user = await userService.findOne({ email })
  if (user === null) throw new AppError('User not found', 404)



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


  const { username, email: useremail } = user


  await EmailService.send({
    template: 'forgotPassword',
    user: { username, email: useremail },
    token: newAccessToken
  })

  res.status(200)
  res.json()
})

export { forgotPassword }
