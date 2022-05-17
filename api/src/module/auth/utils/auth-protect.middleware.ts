import type { NextFunction, Request, Response } from 'express'
import AppError from '../../error/errorApp'
// import AppError from '../../error/errorApp'
import { catchError } from '../../error/utils'
import { Token } from '../services'
// import { AuthStorage } from '../storage'
// import { db } from '../../../setup/config'


export const authProtect = catchError(async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization = '' } = req.headers
  let token: string = ''

  if (authorization?.toLocaleLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  const { data, exp } = Token.verify({ token }) as { data: string, exp: number }

  if (data === undefined || exp === undefined) throw new AppError('Token is not valid', 400)
  if (exp * 1000 < Date.now()) throw new AppError('Token is expired', 400)

  // db.connect()
  // const currentUser = await AuthStorage.findUserById({ id })
  // db.disconnect()

  // // @ts-ignore FIX
  req.locals = {
    accessToken: {
      data
    }
  }
  next()
})
