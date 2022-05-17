import type { Request, Response } from "express"
import { db } from "../../../setup/config"
import AppError from "../../error/errorApp"
import { EmailService } from "../../notifier/email"
import { secureTokens } from "../helpers/secure-token"
import { AuthStorage } from "../storage"

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }

  // TODO MIDDLEWARE: Validate user agent
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)
  // TODO: END TODO

  db.connect()
  const user = await AuthStorage.findUserByEmail({ email })
  if (user === null) throw new AppError('User not found', 404)

  const { newAccessToken, response } = await secureTokens(res, {
    user: user._id,
    at: { data: user._id, expiresIn: '1h' },
    cookie: 'rt',
    agent: userAgent
  })

  db.disconnect()

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
