import type { Request, Response } from "express"
import { EncryptService, TokenService } from "@auth/services"
import { UserRepository } from "@auth/repository"
import { EmailService } from "@notifier/email"
import { AppError } from "@error"

const resetPassword = async (req: Request, res: Response) => {
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)

  const { password } = req.body as { password: string }
  const data = req.locals.accessToken?.data

  const userUpdated = await UserRepository.findOneAndUpdate({ id: data, password: EncryptService.hash(password) })
  if (userUpdated === null) throw new AppError('User not found', 404)

  const { newAccessToken, response } = await TokenService.refresh(res, {
    user: userUpdated._id,
    at: { data: userUpdated._id },
    agent: userAgent,
    cookie: 'rt'
  })

  await EmailService.send({
    template: 'resetPassword',
    user: userUpdated,
    token: newAccessToken
  })

  response.status(200).json({
    message: 'Reset password route',
  })
}

export { resetPassword }