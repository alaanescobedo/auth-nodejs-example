import type { IAppError } from "./errorApp.interface"

interface AppError extends IAppError { }
class AppError extends Error {
  constructor (message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'failure' : 'error'

    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
