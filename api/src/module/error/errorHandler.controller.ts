import type { NextFunction, Request, Response, Send } from 'express'
import { NODE_ENV } from '../../setup/constants'
import type { IAppError } from './errorApp'

const errorHandler = (err: IAppError, req: Request, res: Response, _next?: NextFunction): Response<Send> => {
  err.statusCode = err.statusCode ?? 500
  err.status = err.status ?? 'error'
  console.log({ NODE_ENV })
  if (NODE_ENV !== 'production' && req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode)
    return res.send({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    })
  }

  res.status(500)
  return res.send({ message: 'Something went wrong' })
}

export default errorHandler
