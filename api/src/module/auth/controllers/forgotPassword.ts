import type { Request, Response } from "express"
import { TokenService } from "@auth/services"
import { UserService } from "@user/services"
import { EmailService } from "@notifier/email/services"
import { AppError } from "@error"

const forgotPassword = async (req: Request, res: Response) => {
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)

  const { email } = req.body as { email: string }

  const user = await UserService.findOne({ email })
  if (user === null) throw new AppError('User not found', 404)

  const { newAccessToken, response } = await TokenService.refresh(res, {
    user: user._id,
    at: { data: user._id, expiresIn: '1h' },
    cookie: 'rt',
    agent: userAgent
  })

  const { username, email: useremail } = user

  await EmailService.send({
    template: 'forgotPassword',
    user: { username, email: useremail },
    token: newAccessToken
  })

  response.status(200).json({
    message: 'send email',
  })
}

export { forgotPassword }
