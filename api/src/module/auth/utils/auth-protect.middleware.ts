import type { NextFunction, Request, Response } from 'express'
import AppError from '../../error/errorApp'
import { catchAsync } from '../../error/utils'
import Token from './token.service'
// import { AuthStorage } from '../storage'
// import { db } from '../../../setup/config'


export const authProtect = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization = '' } = req.headers
  const { cookies } = req as { cookies: { jwt: string } }
  const query = req.query as { token: string }
  let token: string = ''

  if (authorization?.toLocaleLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  } else if (cookies?.jwt !== undefined) {
    token = cookies.jwt
  } else if (query?.token !== undefined) {
    token = query.token
  }

  const { id, exp } = Token.verify({ token })
  if (id === undefined || exp === undefined) throw new AppError('Token is not valid', 400)
  if (exp * 1000 < Date.now()) throw new AppError('Token is expired', 400)

  // db.connect()
  // const currentUser = await AuthStorage.findUserById({ id })
  // db.disconnect()

  // // @ts-ignore FIX
  // req.locals = {
  //   user: currentUser,
  //   token: { id, exp }
  // }
  next()
})
