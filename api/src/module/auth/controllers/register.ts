import type { Request, Response } from "express"
import type { SignupClientData } from "@common/auth/interfaces"
import { db } from "@setup/config"
import { UserRepository } from "@auth/repository"
import { EncryptService, TokenService } from "@auth/services"
import { EmailService } from "@notifier/email"
import { AppError, catchError } from "@error"

const register = catchError(async (req: Request, res: Response) => {
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)

  const { username, email, password } = req.body as SignupClientData

  db.connect()
  const user = await UserRepository.create({
    username,
    email,
    password: EncryptService.hash(password)
  })

  const { newAccessToken, response } = await TokenService.refresh(res, {
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