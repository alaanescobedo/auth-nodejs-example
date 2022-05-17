import type { Request, Response } from "express"
import AppError from "../../error/errorApp"
import { EmailService } from "../../notifier/email"
import { secureTokens } from "../helpers/secure-token"
import { Encrypt } from "../services"
import { AuthStorage } from "../storage"

const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body as { password: string }
  const data = req.locals.accessToken?.data

  // TODO MIDDLEWARE: Validate user agent
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)
  // TODO: END TODO

  const userUpdated = await AuthStorage.updatePassword({ id: data, password: Encrypt.hash(password) })
  if (userUpdated === null) throw new AppError('User not found', 404)

  const { newAccessToken, response } = await secureTokens(res, {
    user: userUpdated._id,
    at: { data: userUpdated._id },
    agent: userAgent,
    cookie: 'rt'
  })

  const { username, email } = userUpdated

  await EmailService.send({
    template: 'resetPassword',
    user: { username, email },
    token: newAccessToken
  })

  response.status(200).json({
    message: 'Reset password route',
  })
}

export { resetPassword }