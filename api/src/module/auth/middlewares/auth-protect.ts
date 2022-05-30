import type { NextFunction, Request, Response } from "express"
import { cryptService } from "@auth/services"
import { AppError, catchError } from "@error"

export const authProtect = catchError(async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization = '' } = req.headers
  let token: string = ''

  if (authorization?.toLocaleLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }
  const { data, exp } = cryptService.verify({ token }) as { data: string, exp: number }

  if (data === undefined || exp === undefined) throw new AppError('Token is not valid', 400)
  if (exp * 1000 < Date.now()) throw new AppError('Token is expired', 400)

  // db.connect()
  // const currentUser = await AuthStorage.findUserById({ id })
  // db.disconnect()

  // // @ts-ignore FIX
  req.locals = {
    accessToken: {
      data: {
        userID: data
      }
    }
  }
  next()
})
