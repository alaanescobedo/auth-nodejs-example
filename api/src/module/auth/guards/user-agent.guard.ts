import type { Request } from "express"
import { AppError } from "@error"

export const UserAgentGuard = (req: Request) => {
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)
  return userAgent
}

// export const UserAgentGuard = (req: Request, _res: Response, next: Function) => {
//   const userAgent = UserAgentGuardFn(req)
//   req.locals = {
//     agent: userAgent
//   }
//   next()
// }