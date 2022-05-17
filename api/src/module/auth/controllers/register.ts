import type { Request, Response } from "express"
import type { SignupClientData } from "../../../../../common/src/modules/auth/interfaces/auth.interfaces"
import { db } from "../../../setup/config"
import AppError from "../../error/errorApp"
import { catchError } from "../../error/utils"
import { EmailService } from "../../notifier/email"
import { secureTokens } from "../helpers/secure-token"
import { Encrypt } from "../services"
import { AuthStorage } from "../storage"

const register = catchError(async (req: Request, res: Response) => {
  const { username, email, password } = req.body as SignupClientData

  // TODO MIDDLEWARE: Validate user agent
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)
  // TODO: END TODO

  db.connect()
  const user = await AuthStorage.createUser({
    username,
    email,
    password: Encrypt.hash(password)
  })

  const { newAccessToken, response } = await secureTokens(res, {
    at: { data: user._id },
    user: user._id,
    agent: userAgent,
    cookie: 'rt'
  })
  db.disconnect()

  await EmailService.send({
    template: 'welcome',
    user: { username, email },
    token: newAccessToken
  })

  response.status(200).json({
    status: 'success',
    token: newAccessToken,
  })
})

export { register }