import type { Request, Response } from "express"
import { CookieGuard } from "@auth/guards"
import { TokenService } from "@auth/services"
import { AppError, catchError } from "@error"

type DisconnectTokenMethods = 'revoke' | 'exists'
interface DisconnectParams {
  tokenService?: Pick<ReturnType<typeof TokenService>, DisconnectTokenMethods>
}

const disconnect = ({
  tokenService = TokenService()
}: DisconnectParams) => catchError(async (req: Request, res: Response) => {
  const refreshToken = CookieGuard(req.cookies.rt)

  const exists = await tokenService.exists({ token: refreshToken })
  if (exists === false) throw new AppError('No Content - token not found', 404)

  await tokenService.revoke({ name: 'rt', value: refreshToken })

  res.status(200)
  res.json()
})

export { disconnect }