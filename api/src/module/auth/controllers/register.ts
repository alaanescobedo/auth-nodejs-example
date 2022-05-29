import type { Request, Response } from "express"
import type { SignupClientData } from "@common/auth/interfaces"

import { EmailService } from "@notifier/email/services"
import { catchError } from "@error"
import { UserService } from "@user"
import { UserDTO } from "@user/dto"
import { cryptService, TokenService } from "@auth/services"
import { UserAgentGuard } from "@auth/guards"

const register = ({
  tokenService = TokenService(),
  userService = UserService()
}) => catchError(async (req: Request, res: Response) => {
  const userAgent = UserAgentGuard(req)

  const { username, email, password } = req.body as SignupClientData

  const user = await userService.create({
    username,
    email,
    password
  })


  //TODO: Repeated in a lot of tests - Refactor in a helper
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
  //TODO: END TODO


  await EmailService.send({
    template: 'welcome',
    user: { username, email },
    token: newAccessToken
  })

  const userDTO = UserDTO(user)

  res.status(200)
  res.json({
    status: 'success',
    token: newAccessToken,
    user: userDTO
  })
})

export { register }